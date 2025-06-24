import { describe, it, expect } from 'vitest';
import { Book } from './Book';
import type { BookStatus } from './types';

describe('Book', () => {

    it('créer un livre avec un statut "available" par défaut', () => {
        const book = new Book('1', 'Hunger Games', 'Suzanne Collins');
        expect(book.id).toBe('1');
        expect(book.title).toBe('Hunger Games');
        expect(book.author).toBe('Suzanne Collins');
        expect(book.status).toBe('available');
        expect(book.isAvailable()).toBe(true);
        expect(book.isBorrowed()).toBe(false);
        expect(book.isInMaintenance()).toBe(false);
    });

    it('isAvailable retourne true si le statut est "available"', () => {
        const book = new Book('2', 'Hunger Games : Catching Fire', 'Suzanne Collins');
        book.status = 'available';
        expect(book.isAvailable()).toBe(true);
    });

    it('isBorrowed retourne true si le statut est "borrowed"', () => {
        const book = new Book('3', 'Hunger Games : Mockinjay', 'Suzanne Collins');
        book.status = 'borrowed';
        expect(book.isBorrowed()).toBe(true);
    });

    it('isInMaintenance retourne true si le statut est en "maintenance"', () => {
        const book = new Book('4', 'Hunger Games : The Ballad Of Songbirds And Snakes', 'Suzanne Collins');
        book.status = 'maintenance';
        expect(book.isInMaintenance()).toBe(true);
    });

    it('toutes les méthodes de statut retournent false si le statut est inconnu', () => {
        const book = new Book('5', 'Hunger Games 5 : Sunrise On The Reaping', 'Suzanne Collins');
        book.status = 'lost' as BookStatus;
        expect(book.isAvailable()).toBe(false);
        expect(book.isBorrowed()).toBe(false);
        expect(book.isInMaintenance()).toBe(false);
    });

    it('changer le statut', () => {
        const book = new Book('6', 'Little Women', 'Louisa May Alcott');
        book.status = 'borrowed';
        expect(book.isBorrowed()).toBe(true);
        book.status = 'maintenance';
        expect(book.isInMaintenance()).toBe(true);
    });


});
