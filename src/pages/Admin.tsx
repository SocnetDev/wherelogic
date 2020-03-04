import React, {useState, useEffect} from "react";
import {nextActiveQuest, toggleAnswer, getCurrentQuest} from "../shared/service";

type CommandsListProps = {
    count: number;
}

type CommandProps = {
    name: string;
    points?: number;
}

function Command(props: CommandProps) {
    const [points, setPoints] = useState<any>(props.points || 0);

    const changePoints = (points: number) => {
       if (points >= 0) {
           setPoints(points);
       }
    };

    return (
        <li>
            <div>{ props.name }</div>
            <div>
                Очки команды:
                <strong>{points}</strong>
                <button onClick={ () => {const i = points + 1; changePoints(i);} }>+</button>
                <button onClick={ () => {const i = points - 1; changePoints(i);} }>-</button>
            </div>
        </li>
    );
}

function CommandsList(props: CommandsListProps) {
    const commands = Array.from({length: props.count}, () => null);
    const commandsItems = commands.map((number: any, index: number) =>
        <Command name={ `Команда  ${ index + 1 }` } key={ index }/>
    );
    return (
        <ul>{ commandsItems }</ul>
    );
}

// Экран ведущего
export function Admin() {
    const [quest, setQuest] = useState<any>(null);
    const [questIndex, setQuestIndex] = useState<any>(0);

    useEffect(() => {
        const sub = getCurrentQuest().subscribe((res) => {
            setQuest(res);
        });
        return () => {
            sub.unsubscribe();
        }
    }, []);

    return (
        <div>
            <h2>Настройки текущей игры</h2>
            <CommandsList count={ 3 }/>
            <div>Вопрос {questIndex + 1}:</div>
            {quest ? <strong>{quest.type}</strong>: ''}
            <div>Правильный ответ:</div>
            {quest ? <strong>{quest.rightAnswer}</strong>: ''}
            <div>
                <button onClick={ () => {
                    let index = questIndex;
                    nextActiveQuest(index).then(() => {
                        setQuestIndex(index + 1);
                    });
                } }>Следующий вопрос
                </button>
                <button onClick={ () => {
                    toggleAnswer(true);
                } }>Показать ответ
                </button>
                <button onClick={ () => {
                    toggleAnswer(false);
                } }>Скрыть ответ
                </button>
                <button onClick={ () => {
                    nextActiveQuest(0).then(() => {
                        setQuestIndex(0);
                    });
                } }>Начать с начала
                </button>
            </div>
        </div>
    );
}
