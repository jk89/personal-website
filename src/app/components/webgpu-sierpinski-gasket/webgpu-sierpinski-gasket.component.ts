import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import sierpinski_gasket_shader_fetcher from "./shaders/compute.wgsl";
import { mat4 } from "wgpu-matrix";
import { AssetManagerService } from 'src/app/services/asset-manager.service';
import { PerformanceService } from 'src/app/services/performance.service';

@Component({
  selector: 'webgpu-sierpinski-gasket',
  templateUrl: './webgpu-sierpinski-gasket.component.html',
  styleUrls: ['./webgpu-sierpinski-gasket.component.scss'],
})
export class WebgpuSierpinskiGasketComponent implements OnInit, AfterViewInit, OnDestroy, AfterViewChecked { // 
  @ViewChild('webGPU', { static: false }) canvas: ElementRef<HTMLElement>;
  @ViewChild('webGPUEnabled', { static: false }) webGPUEnabled: ElementRef<HTMLElement>;
  @ViewChild('webGPUBadPeformance', { static: false }) webGPUBadPeformance: ElementRef<HTMLElement>;
  @ViewChild('webGPUBadPeformanceReplacement', { static: false }) webGPUBadPeformanceReplacement: ElementRef<HTMLElement>;


  @Input("verticies") input_verticies: Array<Array<number>> = null;
  @Input("librate") librate: boolean = false;
  @Input("assetId") assetId: string;

  private frameIdx = 0;
  private canvasNativeElement: HTMLCanvasElement;
  private context: GPUCanvasContext;
  private adaptor: GPUAdapter;
  private device: GPUDevice;
  private format: GPUTextureFormat;
  private frameIncrementorInterval: any;
  private computePipelineLayout: GPUPipelineLayout;
  private tetra = [
    [0.0, 1.0, 0.0],  // Apex
    [-1.0, -0.5, 0.5],  // Bottom left
    [1.0, -0.5, 0.5],   // Bottom right
    [0.0, -0.5, -1.0]   // Bottom back
  ];
  private penta = [
    [1.0, 0.0, 0.0],    // Vertex 1
    [0.309, 0.951, 0.0], // Vertex 2
    [-0.809, 0.587, 0.0],// Vertex 3
    [-0.809, -0.587, 0.0],// Vertex 4
    [0.309, -0.951, 0.0], // Vertex 5
  ]

  private vertices = [];
  private computeShaderModule: GPUShaderModule;
  private bindGroupLayout: GPUBindGroupLayout;
  private splatComputePipeline: GPUComputePipeline;
  private screenWriteComputePipeline: GPUComputePipeline;
  private fov = 60 * Math.PI / 180;
  private near = 0.1;
  private far = 1000;
  private orbitRadius = 1;
  private exit = false;
  private frameCount = 0;
  private firstIter = true;
  private lastTimestamp = 0;
  private backgroundImageLink: string = "";

  async initWebGPU() {
    this.canvasNativeElement = this.canvas.nativeElement as HTMLCanvasElement;
    if (this.performanceService.getWebGPUDisabledStatus() == true) {
      this.webGPUEnabled.nativeElement.classList.add("disable-webgpu-disabled-notice");
      this.displayDisabledWebGPU();
      return; // dont re attempt loading the webgpu canvas if the performance last time was bad.
    }
    if (!navigator.gpu) return;
    this.context = this.canvasNativeElement.getContext("webgpu") as GPUCanvasContext;
    this.adaptor = await navigator.gpu?.requestAdapter() as GPUAdapter;
    if (!this.adaptor) return;

    this.vertices = this.input_verticies || this.penta
    this.webGPUEnabled.nativeElement.classList.add("disable-webgpu-disabled-notice");

    this.format = this.adaptor.features.has('bgra8unorm-storage')
      ? navigator.gpu.getPreferredCanvasFormat()
      : 'rgba8unorm';

    this.device = await this.adaptor.requestDevice({
      requiredFeatures: this.format === 'bgra8unorm'
        ? ['bgra8unorm-storage']
        : [],
    }) as GPUDevice;
    this.context.configure({ device: this.device, format: this.format, usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.STORAGE_BINDING });

    const shaderCode = sierpinski_gasket_shader_fetcher(this.vertices, this.librate);

    this.computeShaderModule = this.device.createShaderModule(
      { code: shaderCode }
    );

    this.bindGroupLayout = this.device.createBindGroupLayout({
      label: "computeGroupBindLayout",
      entries: [
        {
          binding: 0, // Texture binding
          visibility: GPUShaderStage.COMPUTE,
          storageTexture: {
            viewDimension: '2d', // View dimension based on your texture
            format: "bgra8unorm",
            access: "write-only"
          },
        },
        {
          binding: 1, // Camera binding
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: 'read-only-storage'
          }
        },
        {
          binding: 2, // Hist binding
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: 'storage'
          }
        },
        {
          binding: 3, // Frame index binding
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: 'read-only-storage'
          }
        },

      ]
    });


    this.computePipelineLayout = this.device.createPipelineLayout({
      bindGroupLayouts: [this.bindGroupLayout]
    });

    this.splatComputePipeline = this.device.createComputePipeline({
      label: 'splat pipeline',
      layout: this.computePipelineLayout,
      compute: {
        module: this.computeShaderModule,
        entryPoint: 'splat',
      },
    });

    this.screenWriteComputePipeline = this.device.createComputePipeline({
      label: 'write screen pipeline',
      layout: this.computePipelineLayout,
      compute: {
        module: this.computeShaderModule,
        entryPoint: 'write_screen',
      },
    });

    this.frameIncrementorInterval = setInterval(() => this.frameIdx++, 25);

    requestAnimationFrame(this.paint);
  };

  paint = () => {
    if (this.exit == true) return;
    const timestamp = performance.now()
    const delta = timestamp - this.lastTimestamp;
    const width = this.canvas.nativeElement.clientWidth;
    const height = this.canvas.nativeElement.clientHeight;
    const aspect = width / height;
    const angle = this.frameIdx / 100;

    let eye = [
      Math.sin(angle) * this.orbitRadius, // x
      Math.cos(angle) * this.orbitRadius, // y
      3 // z
    ];

    const target = [0.0, 0, 0.0];
    const up = [0, 0, 1];
    const view = mat4.lookAt(eye, target, up);

    const perspective = mat4.perspective(this.fov, aspect, this.near, this.far);
    const viewProjectionMatrix = mat4.multiply(perspective, view);

    const viewProjectionBuffer = this.device.createBuffer({
      size: viewProjectionMatrix.length * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });

    new Float32Array(viewProjectionBuffer.getMappedRange()).set(viewProjectionMatrix);
    viewProjectionBuffer.unmap();

    const histSize = width * height;
    const histBuffer = this.device.createBuffer({
      size: histSize * 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    const frameIdxBuffer = this.device.createBuffer({
      size: Uint32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    const canvasTexture = this.context.getCurrentTexture();

    const bindGroup = this.device.createBindGroup(
      {
        layout: this.bindGroupLayout,
        entries: [
          { binding: 0, resource: canvasTexture.createView() },
          {
            binding: 1, resource: {
              buffer: viewProjectionBuffer,
              offset: 0,
              size: Float32Array.BYTES_PER_ELEMENT * viewProjectionMatrix.length
            }
          },
          {
            binding: 2, resource: {
              buffer: histBuffer,
              offset: 0,
              size: Int32Array.BYTES_PER_ELEMENT * histSize
            }
          },
          {
            binding: 3,
            resource: {
              buffer: frameIdxBuffer,
              offset: 0,
              size: Uint32Array.BYTES_PER_ELEMENT
            }
          },
        ],
      }
    );

    // Manually map and fill histBuffer after creation
    this.device.queue.writeBuffer(
      histBuffer,
      0,
      new Int32Array(histSize).fill(0).buffer,
      0,
      histSize * 4
    );

    this.device.queue.writeBuffer(
      frameIdxBuffer,
      0,
      new Float32Array([this.frameIdx]).buffer,
    );

    const splatCommandEncoder = this.device.createCommandEncoder();
    const splatComputePass = splatCommandEncoder.beginComputePass();
    splatComputePass.setPipeline(this.splatComputePipeline);
    splatComputePass.setBindGroup(0, bindGroup);
    splatComputePass.dispatchWorkgroups(64, 64, 1); // 64, 64, 12
    splatComputePass.end();
    const commandSplatBuffer = splatCommandEncoder.finish();

    const screenCommandEncoder = this.device.createCommandEncoder();
    const screenComputePass = screenCommandEncoder.beginComputePass();
    screenComputePass.setPipeline(this.screenWriteComputePipeline);
    screenComputePass.setBindGroup(0, bindGroup);
    screenComputePass.dispatchWorkgroups(canvasTexture.width, canvasTexture.height);
    screenComputePass.end();
    const command_screen_buffer = screenCommandEncoder.finish();
    this.device.queue.submit([commandSplatBuffer, command_screen_buffer]);
    this.frameCount++;

    if (delta > 1000) {
      console.log(`FPS: ${(this.frameCount)}`);
      if (this.firstIter === true) {
        this.firstIter = false;
      }
      else {
        if (this.frameCount < 27) {
          // console.log("Ejecting canvases due to performance issues");
          this.ngOnDestroy();
          this.displayDisabledWebGPU();
          this.performanceService.setWebGPUDisabledStatus(true);
        }
      }
      this.frameCount = 0;
      this.lastTimestamp = timestamp;
    }
    requestAnimationFrame(this.paint);
  };

  private displayDisabledWebGPU() {
    this.webGPUBadPeformance.nativeElement.classList.remove("disable-webgpu-disabled-notice");
    this.webGPUBadPeformanceReplacement.nativeElement.classList.remove("disable-webgpu-disabled-notice");
    this.canvasNativeElement.classList.add("disable-webgpu-disabled-notice");
  }

  constructor(private assetManagerService: AssetManagerService, private performanceService: PerformanceService) {

  }

  ngAfterViewInit(): void {
    if (this.assetId) {
      this.backgroundImageLink = this.assetManagerService.getAssetData(this.assetId).webPPath;
    }
  }

  ngOnInit() {
  }

  loaded = false;
  ngAfterViewChecked(): void {
    const attached = document.contains(this.canvas.nativeElement);
    if (attached && this.loaded === false) {
      this.initWebGPU();
      this.loaded = true;
    };
  }


  ngOnDestroy(): void {
    this.exit = true;

    clearInterval(this.frameIncrementorInterval);
    if (this.device) {
      this.device.destroy();
      this.device = null;
    }

    if (this.context) {
      this.context.unconfigure();
      this.context = null;
    }

    if (this.splatComputePipeline) {
      this.splatComputePipeline = null;
    }

    if (this.screenWriteComputePipeline) {
      this.screenWriteComputePipeline = null;
    }

  }

}
