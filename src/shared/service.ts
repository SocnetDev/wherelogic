import {quests, storage, firestore} from "../firebase";
import {Subject} from 'rxjs';

const activeDoc = firestore.collection('active').doc('quest');
let unsubscribe: Function;
const res = new Subject<any>();
let currentQuest: any;
let allQuests: any[];

export function getCurrentQuest(id: number = 0): Subject<any> {
    if (unsubscribe) {
        unsubscribe();
    }
    unsubscribe = firestore.collection('active').onSnapshot((snapshot) => {
        const firstDoc = snapshot.docs[id];
        if (firstDoc) {
            storage.child(`${ firstDoc.data().id }/`).listAll().then((arr) => {
                Promise.all(arr.items.map(elem => elem.getDownloadURL())).then((files) => {
                    currentQuest = firstDoc;
                    res.next({...firstDoc.data(), fbId: firstDoc.id, images: files});
                })
            });
        }
    });
    return res;
}

export function addAnswer(commandName: string = 'TestName'): void {
    activeDoc.update({
        answers: [...currentQuest.data().answers, {name: commandName, time: new Date().toLocaleTimeString()}]
    });
}

export function clearAnswers() {
    activeDoc.update({
        answers: []
    });
}

export function nextActiveQuest(id: number): void {
    getAllQuests().then((docs) => {
        if (docs[id]) {
            activeDoc.set({
                ...docs[id].data()
            });
        }
    });
}

export function toggleAnswer(show: boolean) {
    activeDoc.update({showAnswer: show});
}

function getAllQuests(): Promise<any> {
    if (allQuests) {
        return Promise.resolve(allQuests);
    } else {
        return quests.get().then((res) => {
            allQuests = res.docs;
            return allQuests;
        })
    }
}
