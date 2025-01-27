import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice";
import InvoiceItems from "../../domain/invoiceItems";
import FindInvoiceUseCase from "./find-invoice.usecase";

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
  items: [item1, item2],
});

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  };
};

describe("Find Invoice use case unit test", () => {
  it("should find a invoice", async () => {
    const repository = MockRepository();
    const usecase = new FindInvoiceUseCase(repository);

    const input = {
      id: "1",
    };

    const result = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toEqual(input.id);
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.address).toEqual(invoice.address);
    expect(result.items.length).toEqual(2);
    expect(result.total).toEqual(422);
    expect(result.createdAt).toEqual(invoice.createdAt);
  });
});
