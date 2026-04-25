export function greet(date: Date = new Date()): string {
    const hour = date.getHours();

    if (hour < 12) {
        return "Good morning!";
    } 
    
    if (hour < 18) {
        return "Good afternoon!";
    }

    return "Good evening!";
}

export default greet;