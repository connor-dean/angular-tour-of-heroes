import { element } from 'protractor';
import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { MessageService } from './message.service';
import { Hero } from './hero';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  db = firebase.firestore().collection('tests');

  constructor(private messageService: MessageService) {}

  getHeroRecords(): Hero[] {
    const heroes = [];
    this.db.onSnapshot(heroResults => {
      heroResults.forEach(heroResult => {
        const tempHero: Hero = {
          name: heroResult.data().name,
          id: heroResult.data().id
        };
        heroes.push(tempHero);
      });
    });
    return heroes;
  }

  getHeroes(): Observable<Hero[]> {
    this.messageService.add('HeroService: fetched heroes');

    const heroes = this.getHeroRecords();
    return of(heroes);
  }

  getHero(id: number): Observable<Hero> {
    this.messageService.add(`HeroService: fetched hero id=${id}`);

    const heroes = this.getHeroRecords();
    return of(heroes.find(hero => hero.id === id));
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }

    const heroes = this.getHeroRecords();
    const matchedHeros = heroes.filter(hero => hero.name === term);
    return of(matchedHeros);
  }

  addHero(hero: Hero): Observable<Hero> {
    this.db.add(hero);
    return of(hero);
  }

  deleteHero(hero: Hero): Observable<Hero> {
    this.db.onSnapshot(heroResults => {
      heroResults.forEach(heroResult => {
        if (hero.id === heroResult.data().id) {
          this.db.doc(heroResult.id).delete();
        }
      });
    });
    return of(hero);
  }

  updateHero(hero: Hero): Observable<any> {
    this.db.onSnapshot(heroResults => {
      heroResults.forEach(heroResult => {
        if (hero.id === heroResult.data().id) {
          this.db.doc(heroResult.id).update(hero);
        }
      });
    });
    return of(hero);
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
