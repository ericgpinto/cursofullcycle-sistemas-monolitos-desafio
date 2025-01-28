import { ClientModel } from "../../client-adm/repository/client.model";
import InvoiceModel from "../repository/invoice.model";
import InvoiceItemsModel from "../repository/invoice-items.model";
import { Sequelize } from "sequelize-typescript";
import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceUseCase from "../usecase/generate/generate.invoice.usecase";
import InvoiceFacade from "./invoice.facade";
import Address from "../../@shared/domain/value-object/address";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";

describe("Invoice Facade tesst", () => {
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

  it("should generate a invoice", async () => {
    const repository = new InvoiceRepository();
    const addUsecase = new GenerateInvoiceUseCase(repository);
    const facade = new InvoiceFacade({
      generateUseCase: addUsecase,
      findUseCase: undefined,
    });

    const input = {
      id: "1",
      name: "Éric",
      document: "45679-4579",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      ),
      items: [
        { id: "1", name: "Item 1", price: 122 },
        { id: "2", name: "Item 2", price: 300 },
      ],
    };

    await facade.generate(input);

    const invoice = await InvoiceModel.findOne({ where: { id: "1" } });

    expect(invoice).toBeDefined();
    expect(invoice.id).toBe(input.id);
    expect(invoice.name).toBe(input.name);
    expect(invoice.document).toBe(input.document);
  });

  it("should find a invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const input = {
      id: "1",
      name: "Éric",
      document: "45679-4579",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      ),
      items: [
        { id: "1", name: "Item 1", price: 122 },
        { id: "2", name: "Item 2", price: 300 },
      ],
    };

    await facade.generate(input);

    const client = await facade.find({ id: "1" });

    expect(client).toBeDefined();
    expect(client.id).toBe(input.id);
    expect(client.name).toBe(input.name);
    expect(client.document).toBe(input.document);
    expect(client.address.street).toBe(input.address.street);
    expect(client.address.number).toBe(input.address.number);
    expect(client.address.complement).toBe(input.address.complement);
    expect(client.address.city).toBe(input.address.city);
    expect(client.address.state).toBe(input.address.state);
    expect(client.address.zipCode).toBe(input.address.zipCode);
  });
});
