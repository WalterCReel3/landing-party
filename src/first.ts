import * as _ from "lodash";

interface Person {
    firstName: string;
    lastName: string;
    fullName: string;

    letterGrade(): string;
}

class Student {
    fullName: string;
    firstName: string;
    middleInitial: string;
    lastName: string;

    grade: number;

    constructor(firstName: string,
                middleInitial: string,
                lastName: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleInitial = middleInitial;
        this.fullName = _.join([firstName, middleInitial, lastName], " ");
        this.grade = 0;
    }

    score(grade: number) {
        this.grade = grade;
    }

    letterGrade(): string {
        let grade = this.grade;
        if (grade >= 90) {
            return "A";
        } else if (grade >= 80) {
            return "B";
        } else if (grade >= 70) {
            return "C";
        } else {
            return "F";
        }
    }
}

function greeter(person: Person) {
    return "Hello, " + person.fullName + ": " + person.letterGrade();
}

let user = new Student("Farl", "J.", "Monkyhammer");
user.score(80);

document.body.innerText = greeter(user);

