import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MlaService } from '../../services/mla.service';
import { MlaProfile } from '../../models/mla.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  mlaProfile: MlaProfile | null = null;

  constructor(private mlaService: MlaService) {}

  ngOnInit(): void {
    this.mlaService.getMlaProfile().subscribe(profile => {
      this.mlaProfile = profile;
    });
  }
}
