import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MlaService } from '../../services/mla.service';
import { MlaProfile } from '../../models/mla.interface';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {
  mlaProfile: MlaProfile | null = null;

  constructor(private mlaService: MlaService) {}

  ngOnInit(): void {
    this.mlaService.getMlaProfile().subscribe(profile => {
      this.mlaProfile = profile;
    });
  }
}
