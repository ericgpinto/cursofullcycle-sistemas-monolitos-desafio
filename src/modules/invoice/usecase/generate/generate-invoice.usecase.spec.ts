import Address from "../../../@shared/domain/value-object/address";
import GenerateInvoiceUseCase from "./generate.invoice.usecase";

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn(),
  };
};

describe("Generate invoice use case unit test", () => {
  it("should generate a invoice", async () => {
    const repository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(repository);

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

    const result = await usecase.execute(input);

    expect(repository.generate).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toEqual(input.name);
    expect(result.address).toEqual(input.address);
    expect(result.items.length).toEqual(2);
    expect(result.total).toEqual(422);
  });
});
