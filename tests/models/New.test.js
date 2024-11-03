const New = require("../models/New");

describe("New Model", () => {
  it("should be defined", () => {
    expect(New).toBeDefined();
  });

  it("should create a new instance with title, content, and author", () => {
    const newInstance = new New({
      title: "Sample News",
      content: "Sample Content",
      author: "Author",
    });
    expect(newInstance.title).toBe("Sample News");
    expect(newInstance.content).toBe("Sample Content");
    expect(newInstance.author).toBe("Author");
  });

  it("should validate required fields", () => {
    const newInstance = new New({});
    const validationError = newInstance.validateSync();
    expect(validationError.errors["title"]).toBeDefined();
    expect(validationError.errors["content"]).toBeDefined();
  });

  it("should save the instance successfully", async () => {
    const newInstance = new New({
      title: "Sample News",
      content: "Sample Content",
      author: "Author",
    });
    const savedInstance = await newInstance.save();
    expect(savedInstance._id).toBeDefined();
  });

  it("should retrieve an instance by ID", async () => {
    const newInstance = new New({
      title: "Another News",
      content: "Content",
      author: "Author",
    });
    const savedInstance = await newInstance.save();
    const foundInstance = await New.findById(savedInstance._id);
    expect(foundInstance.title).toBe("Another News");
  });

  it("should delete an instance successfully", async () => {
    const newInstance = new New({
      title: "Delete News",
      content: "Content",
      author: "Author",
    });
    const savedInstance = await newInstance.save();
    await New.deleteOne({ _id: savedInstance._id });
    const foundInstance = await New.findById(savedInstance._id);
    expect(foundInstance).toBeNull();
  });
});
