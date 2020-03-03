import React, {useState} from "react";
import {nextActiveQuest, toggleAnswer} from "../shared/service";

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

export function Admin() {
    let index = 0;
    // Начальный экран ведущего
    return (
        <div>
            <h2>Настройки текущей игры</h2>
            <CommandsList count={ 3 }/>
            <button onClick={ () => {
                nextActiveQuest(index);
                index++;
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
        </div>
    );
}
