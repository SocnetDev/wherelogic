import React, {ChangeEvent, useState} from "react";
import {nextActiveQuest} from "../shared/service";

type CommandsListProps = {
    count: number;
}

type CommandProps = {
    name: string;
}

function Command(props: CommandProps) {
    const [name, setName] = useState<any>(props.name || '');

    return (
        <li>
            <div>{name}</div>
            <label>Название команды <input type="text"
                                           value={name}
                                           onChange={(e: ChangeEvent<HTMLInputElement>) => {setName(e.target.value)}}/>
            </label>
            <label>Очки команды <input type="number" min="0"/></label>
        </li>
    );
}

function CommandsList(props: CommandsListProps) {
    const commands = Array.from({length: props.count}, () => null);
    const commandsItems = commands.map((number: any, index: number) =>
        <Command name={`Команда  ${index + 1}`} key={index}/>
    );
    return (
        <ul>{commandsItems}</ul>
    );
}

export function Admin() {
    let index = 0;
    // Начальный экран ведущего
    return (
        <div>
            <h2>Настройки текущей игры</h2>
            <CommandsList count={3}/>
            <button onClick={ () => {
                nextActiveQuest(index);
                index++;
            } }>Следующий вопрос
            </button>
        </div>
    );
}
