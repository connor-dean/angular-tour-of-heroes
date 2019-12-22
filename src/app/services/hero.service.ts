import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { Hero } from '../shared/hero';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  db = firebase.firestore().collection('tests');

  constructor(private messageService: MessageService) {}

  getHeroes(): Observable<Hero[]> {
    this.messageService.add('HeroService: fetched heroes');

    return new Observable(observer => {
      this.db.onSnapshot(heroesResults => {
        const heroes: Hero[] = [];
        heroesResults.forEach(hero => {
          const tempHero: Hero = this.mapResponseToHero(hero);
          heroes.push(tempHero);
        });

        // Sort heroes by ID
        heroes.sort((a, b) => {
          return a.id - b.id;
        });

        observer.next(heroes);
      });
    });
  }

  getHero(id: number): Observable<Hero> {
    return new Observable(observer => {
      this.db.onSnapshot(heroesResults => {
        heroesResults.forEach(hero => {
          const tempHero: Hero = this.mapResponseToHero(hero);
          if (id === tempHero.id) {
            observer.next(tempHero);
          }
        });
      });
    });
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }

    return new Observable(observer => {
      this.db.onSnapshot(heroesResults => {
        const heroes: Hero[] = [];
        heroesResults.forEach(hero => {
          const tempHero: Hero = this.mapResponseToHero(hero);
          if (term === tempHero.name) {
            heroes.push(tempHero);
          }
        });

        // Sort heroes by ID
        heroes.sort((a, b) => {
          return a.id - b.id;
        });

        observer.next(heroes);
      });
    });
  }

  mapResponseToHero(hero: firebase.firestore.QueryDocumentSnapshot): Hero {
    return {
      id: hero.data().id,
      documentId: hero.id,
      name: hero.data().name
    }
  }

  addHero(hero: Hero): Observable<Hero> {
    this.db.add(hero);
    return of(hero);
  }

  deleteHero(hero: Hero): Observable<Hero> {
    this.db.doc(hero.documentId).delete();
    return of(hero);
  }

  updateHero(hero: Hero): Observable<Hero> {
    this.db.doc(hero.documentId).update(hero);
    return of(hero);
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
