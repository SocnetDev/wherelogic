import React, {useState, useEffect} from "react";
import {nextActiveQuest, toggleAnswer, getCurrentQuest, getTeamObserver, changeScore} from "../shared/service";

type CommandsListProps = {
    items: [];
}

type CommandProps = {
    id: string;
    name: string;
    score: number;
}

function Command(props: CommandProps) {
    const [score, setScore] = useState<any>(props.score || 0);

    const change = (score: number) => {
       if (score >= 0) {
           setScore(score);
           changeScore(props.id, score);
       }
    };

    return (
        <li>
            <div>{ props.name }</div>
            <div>
                Очки команды:
                <strong>{score}</strong>
                <button onClick={ () => {const i = score + 1; change(i);} }>+</button>
                <button onClick={ () => {const i = score - 1; change(i);} }>-</button>
            </div>
        </li>
    );
}

function CommandsList(props: CommandsListProps) {
    const commands = props.items;
    const commandsItems = commands.map((team: any, index: number) =>
        <Command id={team.id} name={team.name} score={team.score} key={ index }/>
    );
    return (
        <ul>{ commandsItems }</ul>
    );
}

// Экран ведущего
export function Admin() {
    const [quest, setQuest] = useState<any>(null);
    const [questIndex, setQuestIndex] = useState<any>(0);
    const [commands, setCommands] = useState<any>([]);

    useEffect(() => {
        const sub = getCurrentQuest().subscribe((res) => {
            setQuest(res);
        });
        const teamsSub = getTeamObserver().subscribe((teams) => {
            setCommands(teams);
        });

        return () => {
            sub.unsubscribe();
            teamsSub.unsubscribe();
        }
    }, []);


    return (
        <div>
            <h2>Настройки текущей игры</h2>
            {commands ? <CommandsList items={ commands }/> : ''}
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
