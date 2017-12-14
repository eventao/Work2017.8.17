import { NgModule } from '@angular/core';
import { DrawCubeComponent } from './draw-cube/draw-cube';
import { DrawCubeTextureComponent } from './draw-cube-texture/draw-cube-texture';
import { DrawCube2Component } from './draw-cube2/draw-cube2';
@NgModule({
	declarations: [DrawCubeComponent,
    DrawCubeTextureComponent,
    DrawCube2Component],
	imports: [],
	exports: [DrawCubeComponent,
    DrawCubeTextureComponent,
    DrawCube2Component]
})
export class ComponentsModule {}
