import {quests, storage, firestore} from "../firebase";
import {Subject} from 'rxjs';
import * as firebase from 'firebase';

const FieldValue = firebase.firestore.FieldValue;

const activeDoc = firestore.collection('active').doc('quest');
const teamCollection = firestore.collection('teams');
const answerCollection = firestore.collection('answers');
let unsubscribe: Function;
let unsubscribeA: Function;
const res = new Subject<any>();
const team$ = new Subject<any>();
const answers$ = new Subject<any>();
let currentQuest: any;
let allQuests: any[];

export function getCurrentQuest(): Subject<any> {
    if (unsubscribe) {
        unsubscribe();
    }
    unsubscribe = firestore.collection('active').onSnapshot((snapshot) => {
        const firstDoc = snapshot.docs[0];
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
    answerCollection.add({name: commandName, time: new Date().toLocaleTimeString()})
}

export function answersObservable(): Subject<any> {
    if (unsubscribeA) {
        unsubscribeA();
    }
    unsubscribeA = answerCollection.onSnapshot((answers) => {
        answers$.next(answers.docs.map(answer => {
            const data = answer.data();
            data.id = answer.id;
            return data;
        }));
    });
    return answers$;
}

export function clearAnswers(): Promise<any> {
    return Promise.resolve(answerCollection.get().then(({docs}) => {
        docs.forEach((answer) => {
            return answerCollection.doc(answer.id).delete();
        });
    }))
}

export function nextActiveQuest(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
        getAllQuests().then((docs) => {
            if (docs[id]) {
                clearAnswers().then(() => {
                    resolve(activeDoc.set({
                        ...docs[id].data()
                    }));
                });
            } else {
                activeDoc.update({
                    gameOver: true
                });
                reject();
            }
        });
    });
}

export function toggleAnswer(show: boolean) {
    activeDoc.update({showAnswer: show});
}

export function createTeam(name: string): Promise<any> {
    return teamCollection.add({
        name, score: 0
    });
}

export function updateTeam(team: string, name: string) {
    teamCollection.doc(team).update({name});
}

export function changeScore(team: string, score: number = 0) {
    const curTeam = teamCollection.doc(team);
    curTeam.get().then((team) => {
        curTeam.update({score: score});
    });
}

export function getTeamObserver(): Subject<any> {
    teamCollection.onSnapshot((teams) => {
        team$.next(teams.docs.map(team => {
            const data = team.data();
            data.id = team.id;
            return data;
        }));
    });
    return team$;
}

export function removeAllTeam() {
    teamCollection.get().then(({docs}) => {
        docs.forEach((team) => {
            teamCollection.doc(team.id).delete();
        });
    })
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
