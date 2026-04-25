import greet from "../src/lib/greeter";

describe("greet", () => {
    it("should return 'Good morning!' before 12 PM", () => {
        const date = new Date("2024-06-01T08:00:00");
        expect(greet(date)).toBe("Good morning!");
    });

    it("should return 'Good afternoon!' between 12 PM and 6 PM", () => {
        const date = new Date("2024-06-01T14:00:00");
        expect(greet(date)).toBe("Good afternoon!");
    });

    it("should return 'Good evening!' after 6 PM", () => {
        const date = new Date("2024-06-01T19:00:00");
        expect(greet(date)).toBe("Good evening!");
    });

    it("should return the correct greeting based on the current time if no date is provided", () => {
        const currentHour = new Date().getHours();
        const greeting = greet();

        if (currentHour < 12) {
            expect(greeting).toBe("Good morning!");
        } else if (currentHour < 18) {
            expect(greeting).toBe("Good afternoon!");
        } else {
            expect(greeting).toBe("Good evening!");
        }
    });
});