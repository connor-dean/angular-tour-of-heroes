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
  heroes: Hero[] = [];
  db = firebase.firestore().collection('tests');

  constructor(private messageService: MessageService) {
    this.getRecords();
  }

  getRecords(): void {
    this.db.onSnapshot(heroes => {
      heroes.forEach(hero => {
        const tempHero = {
          name: hero.data().name,
          id: hero.data().id
        };
        this.heroes.push(tempHero);
      });
    });
  }

  getHeroes(): Observable<Hero[]> {
    this.messageService.add('HeroService: fetched heroes');
    return of(this.heroes);
  }

  getHero(id: number): Observable<Hero> {
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(this.heroes.find(hero => hero.id === id));
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }

    const matchedHeros = this.heroes.filter(hero => hero.name === term);

    return of(matchedHeros);
  }

  addHero(hero: Hero): void {
    this.db.add(hero);
  }

  deleteHero(hero: Hero): void {
    this.db.onSnapshot(docs => {
      docs.forEach(doc => {
        if (hero.id === doc.data().id) {
          this.db.doc(doc.id).delete();
        }
      });
    });
  }

  updateHero(hero: Hero): void {
    this.db.onSnapshot(docs => {
      docs.forEach(doc => {
        if (hero.id === doc.data().id) {
          this.db.doc(doc.id).update(hero);
        }
      });
    });
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
