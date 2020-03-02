import React, {useEffect, useState} from "react";
import {quests, storage} from "./../firebase";

/*
* Основной экран который видят игроки на проекторе
* на данном этапе мы будем в коллекции ИГРА хранить 1 вопрос
* в нем будут необходимые данные и пустой массив команд
* когда команды будут кликать мы выводим на экран список со временем - профит
*
* */


export function Game() {
    const [quest, setQuest] = useState<any>(null);
    const [photo, setPhoto] = useState<any>([]);
    const [questNumber, setQuestNumber] = useState<number>(0);

    useEffect(() => {
        let unsubscribe = quests.onSnapshot((snapshot) => {
            const firstDoc = snapshot.docs[questNumber];
            if (firstDoc) {
                setQuest(firstDoc);
                storage.child(`${ firstDoc.data().id }/`).listAll().then((arr) => {
                    Promise.all(arr.items.map(elem => elem.getDownloadURL())).then((files) => {
                        setPhoto(files);
                    })
                });
            }
        });
        return () => unsubscribe();
    }, [questNumber]);

    const addTestAnswer = (): void => {
        quests.doc(quest.id).update({
            answers: [...quest.data().answers, {name: `Name`, time: new Date().toLocaleTimeString()}]
        });
    }

    const clearAnswers = () => {
        quests.doc(quest.id).update({
            answers: []
        });
    }

    return <div>
        { quest ?
            <div>
                <div>{ quest.data().text }</div>
                <div>{ quest.data().answers?.map((el: any) => <div>{ el.name + ' ' + el.time }</div>) }</div>
                { photo.map((elem: string, key: number) => <img src={ elem } alt={ 'Quest' } key={ key }/>) }
            </div> : <div>Загрузка...</div> }
        <button onClick={ () => setQuestNumber(questNumber ? 0 : 1) }>Переключить опрос</button>
        <button onClick={ () => addTestAnswer() }>Добавить ответ</button>
        <button onClick={ () => clearAnswers() }>Очистить ответы</button>
    </div>;
}
