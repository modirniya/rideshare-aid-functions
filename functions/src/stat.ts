import * as functions from 'firebase-functions';
import admin = require("firebase-admin");


"use strict";

// let userInfo: any;
exports.stat = functions.https.onCall((data, context) => {
    console.log("Start newEntry");
    const city_code: string = data.city_code;
    const selection: string = data.selection;
    if (!context.auth) {
        throwError(
            "failed-precondition",
            "The function must be called " + "while authenticated."
        );
    } else {
        // userInfo = {
        //     uid: context.auth.uid || null,
        //     name: context.auth.token.name || null,
        //     email: context.auth.token.email || null,
        // };
        const ref = admin.database().ref("Statistics").child(city_code);
        intIncrementer(ref.child(selection)).then(() => {
            return intIncrementer(ref.child("total"))
        }).then(snapshot => {
            return snapshot;
        }).catch(() => {
            throwError("Statistics", "Statistics");
        })

    }

    function throwError(prompt: String, desc: string) {
        throw new functions.https.HttpsError("invalid-argument", String(desc));
    }

    async function intIncrementer(reference: admin.database.Reference) {
        return reference.transaction(function (current_value) {
            return (current_value || 0) + 1;
        });
    }
});