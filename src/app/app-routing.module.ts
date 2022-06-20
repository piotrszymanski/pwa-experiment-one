import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentOneComponent } from './component-one/component-one.component';
import { ComponentTwoComponent } from './component-two/component-two.component';

const routes: Routes = [
  {
    path: 'component-one',
    component: ComponentOneComponent,
  },
  {
    path: 'component-two',
    component: ComponentTwoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
