import React, {useState} from "react";
import {createTeam, updateTeam, removeAllTeam, changeScore} from "../shared/service";

export function PlayerScreen() {
    const [team, setTeam] = useState<string>('');

    function createOrUpdate() {
        if (team) {
            updateTeam(team, 'UpdateName')
        } else {
            createTeam('NewTeam').then((team) => {
                setTeam(team.id);
            });
        }
    }

    function removeTeam() {
        removeAllTeam();
    }

    function getMeScore() {
        changeScore(team, 3);
    }

    // Тут короче то что видит игрок, а именно большую кнопку)
    // По ней для простоты будем в ФБ записывать имя команды и время и показывать на экране список формата
    // КОМАНДА А - 10:04:55
    // Перед кнопкой надо запросить ввести имя команды
    return <div>
        <h2>PlayerScreen</h2>
        <button onClick={ () => createOrUpdate() }>Создать/обновить команду</button>
        <button onClick={ () => removeTeam() }>Удалить команду</button>
        <button onClick={ () => getMeScore() }>Добавить мне </button>
    </div>;
}
