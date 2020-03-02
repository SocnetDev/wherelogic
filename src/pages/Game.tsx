import React, {useEffect, useState} from "react";
import {quests, storage} from "./../firebase";

export function Game() {
    const [quest, setQuest] = useState<any>(null);
    const [photo, setPhoto] = useState<any>([]);
    const [questNumber, setQuestNumber] = useState<number>(0);

    useEffect(() => {
        let unsubscribe = quests.onSnapshot((snapshot) => {
            const firstDoc = snapshot.docs[questNumber]?.data();
            if (firstDoc) {
                setQuest(firstDoc);
                storage.child(`${ firstDoc.id }/`).listAll().then((arr) => {
                    Promise.all(arr.items.map(elem => elem.getDownloadURL())).then((files) => {
                        setPhoto(files);
                    })
                });
            }
        });
        return () => unsubscribe();
    }, [questNumber]);

    return <div>
        { quest ? <div>{ quest.text }</div> : <div>Загрузка...</div> }
        { photo.map((elem: string, key: number) => <img src={ elem } alt={ 'Quest' } key={ key }/>) }
        <button onClick={ () => setQuestNumber(questNumber + 1) }>ТУДЫ</button>
        <button onClick={ () => setQuestNumber(questNumber - 1) }>СЮДЫ</button>
    </div>;
}
