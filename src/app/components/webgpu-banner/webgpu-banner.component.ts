import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import vert from "./shaders/vert.wgsl";
import frag from "./shaders/frag.wgsl";

@Component({
    selector: 'webgpu-banner',
    templateUrl: './webgpu-banner.component.html',
    styleUrls: ['./webgpu-banner.component.scss'],
})
export class WebgpuBannerComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('webGPU', { static: false }) canvas: ElementRef<HTMLElement>;
    private frameIdx = 0;
    private canvasNativeElement: HTMLCanvasElement;
    private context: GPUCanvasContext;
    private adaptor: GPUAdapter;
    private device: GPUDevice;
    private format: GPUTextureFormat;
    private uniformTime: GPUBuffer;
    private uniformBindGroupLayout: GPUBindGroupLayout;
    private uniformBindGroup: GPUBindGroup;
    private renderPipelineLayout: GPUPipelineLayout;
    private renderPipeline: GPURenderPipeline;
    private renderPassDescriptor: GPURenderPassDescriptor;
    private commandEncoder: GPUCommandEncoder;
    private view: GPUTextureView;
    private frameIncrementorInterval: any;

    async initWebGPU() {
        this.canvasNativeElement = this.canvas.nativeElement as HTMLCanvasElement;
        if (!navigator.gpu) return;
        this.context = this.canvasNativeElement.getContext("webgpu") as GPUCanvasContext;
        this.adaptor = await navigator.gpu?.requestAdapter() as GPUAdapter;
        if (!this.adaptor) return;
        this.device = await this.adaptor.requestDevice() as GPUDevice;
        this.format = navigator.gpu.getPreferredCanvasFormat();
        this.context.configure({ device: this.device, format: this.format });

        this.uniformTime = this.device.createBuffer({ size: Float32Array.BYTES_PER_ELEMENT, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST })
        
        this.uniformBindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: {
                        type: "uniform"
                    }
                }
            ]
        });

        this.uniformBindGroup = this.device.createBindGroup({
            layout: this.uniformBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.uniformTime,
                        offset: 0,
                        size: 4
                    }
                }
            ]
        });

        this.renderPipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [this.uniformBindGroupLayout]
        });

        this.renderPipeline = this.device.createRenderPipeline({
            layout: this.renderPipelineLayout,
            vertex: {
                module: this.device.createShaderModule({
                    code: vert
                }),
                entryPoint: "vert"
            },
            fragment: {
                module: this.device.createShaderModule({
                    code: frag,
                }),
                entryPoint: "frag",
                targets: [{ format: this.format }]
            },
            primitive: { topology: "triangle-list" }
        });

        this.frameIncrementorInterval = setInterval(() => this.frameIdx++, 25);

        requestAnimationFrame(this.paint);
    };

    paint = () => {
        if (this.exit == true) return;
        this.commandEncoder = this.device.createCommandEncoder();
        this.view = this.context.getCurrentTexture().createView();

        this.renderPassDescriptor = {
            colorAttachments: [
                {
                    view: this.view,
                    loadOp: "clear",
                    storeOp: "store",
                    clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 }
                }
            ]
        };

        this.device.queue.writeBuffer(this.uniformTime, 0, new Float32Array([this.frameIdx]));
        const renderPass = this.commandEncoder.beginRenderPass(this.renderPassDescriptor);
        renderPass.setPipeline(this.renderPipeline);
        renderPass.setBindGroup(0, this.uniformBindGroup);
        renderPass.draw(6, 1);
        renderPass.end();
        this.device.queue.submit([this.commandEncoder.finish()]);
        requestAnimationFrame(this.paint);
    };

    constructor() { }

    ngAfterViewInit(): void {
        this.initWebGPU();
    }

    ngOnInit() {
    }

    exit = false;
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

        if (this.renderPipeline) {
           this.renderPipeline = null;
        }

        if (this.uniformTime) {
            this.uniformTime.destroy();
        }

    }

}
