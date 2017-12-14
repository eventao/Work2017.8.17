import { NgModule } from '@angular/core';
import { DrawCubeComponent } from './draw-cube/draw-cube';
import { DrawCubeTextureComponent } from './draw-cube-texture/draw-cube-texture';
@NgModule({
	declarations: [DrawCubeComponent,
    DrawCubeTextureComponent],
	imports: [],
	exports: [DrawCubeComponent,
    DrawCubeTextureComponent]
})
export class ComponentsModule {}
