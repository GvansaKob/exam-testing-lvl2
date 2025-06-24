import { describe, it, expect, beforeEach } from 'vitest';
import { LoanService } from './LoanService';
import { Book } from './Book';
import { User } from './User';
import { UserCategory } from './types';

describe('LoanService', () => {
    let service: LoanService;
    let book: Book;
    let user: User;

    beforeEach(() => {
        service = new LoanService();
        book = new Book('1', 'Hunger Games', 'Suzanne Collins');
        user = new User('u1', 'Gvansa', 'Standard');

        service.addBook(book);
        service.addUser(user);
    });

    it('ajoute et récupère un livre', () => {
        expect(service.getBook('1')).toBe(book);
    });

    it('ajoute et récupère un user', () => {
        expect(service.getUser('u1')).toBe(user);
    });

    it('effectue un emprunt avec succès', () => {
        const success = service.borrowBook('1', 'u1', new Date('2023-01-01'));
        expect(success).toBe(true);
        expect(book.status).toBe('borrowed');
        expect(book.borrowedBy).toBe('u1');
        expect(book.dueDate?.toDateString()).toBe(new Date('2023-01-15').toDateString());
    });

    it('refuse un emprunt si le livre est déjà emprunté', () => {
        service.borrowBook('1', 'u1');
        const secondTry = service.borrowBook('1', 'u1');
        expect(secondTry).toBe(false);
    });

    it('retourne un livre sans pénalité', () => {
        service.borrowBook('1', 'u1', new Date('2023-01-01'));
        const penalty = service.returnBook('1', new Date('2023-01-10'));
        expect(penalty).toBe(0);
        expect(book.status).toBe('available');
        expect(book.borrowedBy).toBeUndefined();
    });

    it('calcule une pénalité si retour en retard', () => {
        service.borrowBook('1', 'u1', new Date('2023-01-01'));
        const penalty = service.returnBook('1', new Date('2023-02-01')); // 17 jours de retard
        expect(penalty).toBeCloseTo(17 * 0.5);
    });

    it('getBorrowedBooks : retourne les livres empruntés', () => {
        service.borrowBook('1', 'u1');
        const borrowed = service.getBorrowedBooks();
        expect(borrowed).toContain(book);
    });

    it('getAvailableBooks : retourne les livres disponibles', () => {
        const available = service.getAvailableBooks();
        expect(available).toContain(book);
        service.borrowBook('1', 'u1');
        const afterBorrow = service.getAvailableBooks();
        expect(afterBorrow).not.toContain(book);
    });

    it('getUserLoans : retourne les livres empruntés par un utilisateur', () => {
        service.borrowBook('1', 'u1');
        const loans = service.getUserLoans('u1');
        expect(loans).toContain(book);
    });

    it('getOverdueBooks : retourne les livres en retard', () => {
        service.borrowBook('1', 'u1', new Date('2023-01-01'));
        const overdue = service.getOverdueBooks(new Date('2023-02-01'));
        expect(overdue).toContain(book);
    });
});
