import newDatabase from "./lib/database/database";

import {DatabaseDriver, Operators, QueryType} from "./lib/database/types/enum";

async function TestDB () {
    const db = await newDatabase({driver: DatabaseDriver.LOCAL});

    const q2 = await db.query({
        type: QueryType.Select,
        table: "mekapet",
        condition: [
            {operator: Operators.EQ, key: "chouette", value: "truc"},
            {operator: Operators.OTHER, key: "super", value: "IS NOT NULL"}
        ],
        fields: ["machin", "bidule"]
    });
    console.log("Query 2 :")
    console.log(q2)
    const q3 = await db.query({
        type: QueryType.Insert,
        table: "table",
        values: [
            {key: "truc", value: "bidule"},
            {key: "foo", value: 42},
            {key: "bar", value: "foo"},
        ]
    });
    console.log("Query 3 :")
    console.log(q3)
    const q1 = await db.query({
        type: QueryType.Select,
        table: "table"
    });
    console.log("Query 1 :")
    console.log(q1)
    const q4 = await db.query({
        type: QueryType.Update,
        table: "table",
        modifier: [
            {key: "truc", value: "machin"},
            {key: "bar", value: "huitre"}
        ]
    });
    console.log("Query 4 :")
    console.log(q4)
    const q5 = await db.query({
        type: QueryType.Delete,
        table: "table",
        condition: [
            {operator: Operators.EQ, key: "chouette", value: "truc"},
            {operator: Operators.OTHER, key: "super", value: "IS NOT NULL"}
        ]
    });
    console.log("Query 5 :")
    console.log(q5)
}
console.log("Bonjour")
TestDB();