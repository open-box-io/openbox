import {
    GamemodeResponse,
    GamemodeVersion,
} from '@openbox/common/src/types/gamemodeTypes';
import React, { useCallback, useEffect, useState } from 'react';

import Button from '../../UI/Button/Button';
import GamemodeDetailsCard from '../../UI/GamemodeDetailsCard/GamemodeDetailsCard';
import Input from '../../UI/Input/Input';
import Throbber from '../../UI/Throbber/Throbber';
import { getGamemode } from '../../../api/game';
import { searchGamemodeDetails } from '../../../api/gamemodeDetails';
import styles from './gamePicker.module.scss';

interface GamePickerProps {
    selectGame: (game: GamemodeVersion, resourceName: string) => Promise<void>;
}

const GamePicker = ({ selectGame }: GamePickerProps): JSX.Element => {
    const [results, setResults] = useState<GamemodeResponse[]>();
    const [searchText, setSearchText] = useState<string>(``);

    const [game, setGame] = useState<GamemodeResponse>();
    const [gamemode, setGamemode] = useState<GamemodeVersion>();

    useEffect(() => {
        searchGamemodeDetails().then((result) => {
            setResults(result.gamemodes);
        });
    }, []);

    useEffect(() => {
        if (!game) return;

        getGamemode(
            game.githubUser,
            game.githubRepo,
            game.approvedVersion || ``,
        ).then((result) => {
            setGamemode(result);
        });
    }, [game]);

    const render = useCallback(() => {
        if (game) {
            return (
                <GamemodeDetailsCard
                    game={game}
                    selected
                    onSelected={(resources) => {
                        gamemode && selectGame(gamemode, resources as string);
                    }}
                />
            );
        }

        if (results === undefined) {
            return <Throbber />;
        }

        if (!results.length) {
            return <div>No results found</div>;
        }

        return results.map((game) => (
            <GamemodeDetailsCard
                key={game._id}
                game={game}
                onSelected={() => setGame(game)}
            />
        ));
    }, [game, gamemode, results, selectGame]);

    return (
        <section className={styles.Picker}>
            {game ? null : (
                <div className={styles.searchBar}>
                    <Input
                        type="text"
                        label="Search"
                        value={searchText}
                        onChange={(text) => setSearchText(text.target.value)}
                    />
                    <Button
                        onClick={() => {
                            setResults(undefined);
                            searchGamemodeDetails(searchText).then((result) => {
                                setResults(result.gamemodes);
                            });
                        }}
                    >
                        Search
                    </Button>
                </div>
            )}

            {render()}
        </section>
    );
};

export default GamePicker;
