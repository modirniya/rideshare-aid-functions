import * as functions from 'firebase-functions';
import admin = require("firebase-admin");


"use strict";

let userInfo: any;
const maxChildNodes = 99;

exports.newEntry = functions.https.onCall((data, context) => {
    console.log("Start newEntry");
    const city: string = data.city;
    const entry: string = data.entry;
    if (!context.auth) {
        throwError(
            "failed-precondition",
            "The function must be called " + "while authenticated."
        );
    } else {
        userInfo = {
            uid: context.auth.uid || null,
            name: context.auth.token.name || null,
            email: context.auth.token.email || null,
        };
        const ref = admin.database().ref("Forums").child(city);
        ref.orderByKey().once("value").then((snapshot) => {
            const updates = {};
            if (snapshot.numChildren() > maxChildNodes) {
                let childCount = 0;
                snapshot.forEach((child) => {
                    if (++childCount <= snapshot.numChildren() - maxChildNodes) {
                        // @ts-ignore
                        updates[child.key] = null;
                    }
                });
            }
            return updates;
        }).then(updates => {
            return ref.update(updates);
        }).catch(()=>{
            throwError("Error", "While limiting nodes")
        })


        ref.push({
            "name": userInfo.name,
            "text": entry,
            "uid": userInfo.uid,
        }).then((snapshot) => {
                return snapshot
            }
        ).catch(() => {
            throwError("Error", "While push data")
        });
    }


    function throwError(prompt: String, desc: string) {
        throw new functions.https.HttpsError("invalid-argument", String(desc));
    }
});