import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { PlayPage } from "./play.page";

import { PlayPageRoutingModule } from "./play-routing.module";
import { StageComponent } from "./stage/stage.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, PlayPageRoutingModule],
  declarations: [PlayPage, StageComponent],
})
export class PlayPageModule {}
