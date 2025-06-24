import { describe, it, expect, beforeEach } from 'vitest';
import { RestaurantSystem } from './RestaurantService';

describe('RestaurantSystem - Tests d’intégration', () => {
  let system: RestaurantSystem;

  beforeEach(() => {
    system = new RestaurantSystem();
  });

  it('crée une commande avec la facture (dans un cas normal)', () => {
    const customer = system.getCustomerService().createCustomer({
      name: 'Gvansa Kobesashvili',
      email: 'gvansa@gmail.com',
      address: '4 avenue des bonbons',
      phone: '0676468754'
    });

    const product = system.getProductService().createProduct({
      name: 'Pates bolognaise',
      description: 'Meilleur pates de la ville de GvansaLand',
      price: 12.5,
      category: 'main',
      available: true,
      preparationTimeMinutes: 15
    });

    const { order, invoice } = system.processOrder(customer.id, [
      { productId: product.id, quantity: 2 }
    ]);

    expect(order).not.toBeNull();
    expect(order?.customerId).toBe(customer.id);
    expect(order?.items).toHaveLength(1);
    expect(order?.totalAmount).toBeCloseTo(25);

    expect(invoice).not.toBeNull();
    expect(invoice?.orderId).toBe(order?.id);
    expect(invoice?.totalAmount).toBeCloseTo(25);
  });

  it('retourne null si le client est inconnu', () => {
    const product = system.getProductService().createProduct({
      name: 'Pizza bonbon',
      description: 'Un peu sucré, un peu salé',
      price: 8,
      category: 'starter',
      available: true,
      preparationTimeMinutes: 5
    });

    const { order, invoice } = system.processOrder('unknown-client-id', [
      { productId: product.id, quantity: 1 }
    ]);

    expect(order).toBeNull();
    expect(invoice).toBeNull();
  });

  it('retourne null si un produit est invalide', () => {
    const customer = system.getCustomerService().createCustomer({
      name: 'Sonny',
      email: 'son@gmail.com',
      address: '2 rue de MDS',
      phone: '0987643456'
    });

    const { order, invoice } = system.processOrder(customer.id, [
      { productId: 'wrong-id', quantity: 1 }
    ]);

    expect(order).toBeNull();
    expect(invoice).toBeNull();
  });

  it('retourne null si aucun produit n’est fourni', () => {
    const customer = system.getCustomerService().createCustomer({
      name: 'Ariella',
      email: 'ariel@gmail.com',
      address: '65 Avenue tasty',
      phone: '0167543675'
    });

    const { order, invoice } = system.processOrder(customer.id, []);

    expect(order).toBeNull();
    expect(invoice).toBeNull();
  });
});
