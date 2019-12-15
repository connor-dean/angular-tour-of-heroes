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
          const tempHero: Hero = {
            id: hero.data().id,
            name: hero.data().name
          };
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
          const tempHero: Hero = {
            id: hero.data().id,
            name: hero.data().name
          };

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
          const tempHero: Hero = {
            id: hero.data().id,
            name: hero.data().name
          };

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

  addHero(hero: Hero): Observable<Hero> {
    this.db.add(hero);
    return of(hero);
  }

  deleteHero(hero: Hero): Observable<Hero> {
    this.db.onSnapshot(heroResults => {
      heroResults.forEach(heroResult => {
        const heroResultId = heroResult.data().id;
        const heroResultName = heroResult.data().name;
        if (hero.id === heroResultId && hero.name === heroResultName) {
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
