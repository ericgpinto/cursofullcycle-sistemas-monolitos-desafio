import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../../client-adm/repository/client.model";
import Invoice from "../domain/invoice";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItems from "../domain/invoiceItems";
import InvoiceRepository from "./invoice.repository";
import InvoiceModel from "./invoice.model";
import InvoiceItemsModel from "./invoice-items.model";
import invoice from "../domain/invoice";

describe("Invoice repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
    const item1 = new InvoiceItems({
      id: new Id("1"),
      name: "Item 1",
      price: 122,
    });

    const item2 = new InvoiceItems({
      id: new Id("2"),
      name: "Item 2",
      price: 300,
    });

    const invoice = new Invoice({
      id: new Id("1"),
      name: "Lucian",
      document: "1234-5678",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      ),
      items: [item1, item2],
    });

    const repository = new InvoiceRepository();
    await repository.generate(invoice);

    const invoiceDb = await InvoiceModel.findOne({
      where: { id: "1" },
      include: [{ model: InvoiceItemsModel, as: "items" }],
    });

    expect(invoiceDb).toBeDefined();
    expect(invoiceDb.id).toEqual(invoice.id.id);
    expect(invoiceDb.name).toEqual(invoice.name);
    expect(invoiceDb.document).toEqual(invoice.document);
    expect(invoiceDb.street).toEqual(invoice.address.street);
    expect(invoiceDb.number).toEqual(invoice.address.number);
    expect(invoiceDb.complement).toEqual(invoice.address.complement);
    expect(invoiceDb.city).toEqual(invoice.address.city);
    expect(invoiceDb.state).toEqual(invoice.address.state);
    expect(invoiceDb.zipcode).toEqual(invoice.address.zipCode);
    expect(invoiceDb.items.length).toEqual(2);
  });

  it("should find an invoice", async () => {
    const invoice = await InvoiceModel.create(
      {
        id: "1",
        name: "Lucian",
        document: "1234-5678",
        street: "Rua 123",
        number: "99",
        complement: "Casa Verde",
        city: "Criciúma",
        state: "SC",
        zipcode: "88888-888",
        items: [
          { id: "1", name: "Item 1", price: 122 },
          { id: "2", name: "Item 2", price: 300 },
        ],
        createdAt: new Date(),
      },
      { include: [{ model: InvoiceItemsModel, as: "items" }] }
    );

    const repository = new InvoiceRepository();

    const result = await repository.find(invoice.id);

    expect(result.id.id).toEqual(invoice.id);
    expect(result.name).toEqual(invoice.name);
    expect(result.address.street).toEqual(invoice.street);
    expect(result.address.number).toEqual(invoice.number);
    expect(result.address.complement).toEqual(invoice.complement);
    expect(result.address.city).toEqual(invoice.city);
    expect(result.address.state).toEqual(invoice.state);
    expect(result.address.zipCode).toEqual(invoice.zipcode);
    expect(result.items.length).toEqual(2);
  });
});
