import { Component, OnInit } from '@angular/core';
import { Hero } from '../../shared/hero';
import { HeroService } from '../../services/hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[];

  constructor(private heroService: HeroService) {}

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe(heroes => (this.heroes = heroes));
  }

  add(newName: string): void {
    newName = newName.trim();
    if (!newName) {
      return;
    }

    const newId = Math.max(...this.heroes.map(hero => hero.id)) + 1;
    const newHero = {
      name: newName,
      id: newId
    };

    this.heroService.addHero(newHero).subscribe(hero => {
      this.heroes.push(hero);
    });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero);
  }
}
