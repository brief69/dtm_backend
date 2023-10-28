

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

// 新規ユーザーの登録時にFirestoreにユーザー情報を保存
export const createUserRecord = functions.auth.user().onCreate((user) => {
    const userRef = db.collection('users').doc(user.uid);

    return userRef.set({
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
});

// ユーザー情報のアップデート
export const updateUserRecord = functions.firestore.document('users/{userId}')
    .onUpdate((change, context) => {
        const newData = change.after.data();
        newData.updatedAt = new Date();

        return change.after.ref.set(newData, { merge: true });
    });

// ユーザーが削除されたときにFirestoreのユーザー情報も削除
export const deleteUserRecord = functions.auth.user().onDelete((user) => {
    const userRef = db.collection('users').doc(user.uid);

    return userRef.delete();
});
