import React, { useEffect, useState } from 'react';
import {
    getGithubResourceFile,
    getGithubResourceList,
} from '../../../api/game';

import Button from '../Button/Button';
import { GamemodeResponse } from '@openbox/common/src/types/gamemodeTypes';
import { cssCombine } from '../../../shared/SCSS/scssHelpers';
import styles from './gamemodeDetailsCard.module.scss';

interface GamemodeDetailsCardProps {
    game: GamemodeResponse;
    selected?: boolean;

    onSelected: (resources?: string) => void;
}

function GamemodeDetailsCard({
    game,
    selected,
    onSelected,
}: GamemodeDetailsCardProps): JSX.Element {
    const [open, setOpen] = useState<boolean>(!!selected);

    const [resourceNames, setResourceNames] = useState<string[]>([]);
    const [selectedResourceName, setSelectedResourceName] = useState<string>();
    const [selectedResource, setSelectedResource] = useState<string>();

    useEffect(() => {
        if (!open) return;

        getGithubResourceList(
            game.githubUser,
            game.githubRepo,
            game.approvedVersion || ``,
        ).then((response) => {
            setResourceNames(response);
            response[0] && setSelectedResourceName(response[0]);
        });
    }, [game, open]);

    useEffect(() => {
        if (!selectedResourceName) return;

        getGithubResourceFile(
            game.githubUser,
            game.githubRepo,
            game.approvedVersion || ``,
            selectedResourceName,
        ).then((response) => {
            setSelectedResource(response);
        });
    }, [game, selectedResourceName]);

    return (
        <button
            onClick={() => !selected && setOpen((open) => !open)}
            className={cssCombine(
                !open && styles.GamemodeClosed,
                open && styles.GamemodeOpen,
            )}
        >
            <div className={styles.GamemodeDetails}>
                <div className={styles.Name}>{game.name}</div>

                <div
                    className={cssCombine(
                        styles.Description,
                        !open && styles.DescriptionHidden,
                    )}
                >
                    {game.description}
                </div>

                <div className={styles.Author}>{game.author.nickname}</div>

                <div
                    className={cssCombine(open ? styles.Detail : styles.Closed)}
                >
                    {selected ? (
                        <select
                            name="Resource"
                            onChange={(event) => {
                                setSelectedResourceName(event.target.value);
                            }}
                        >
                            {resourceNames.map((resource) => (
                                <option key={resource} value={resource}>
                                    {resource}
                                </option>
                            ))}
                        </select>
                    ) : null}
                    <Button
                        onClick={() => {
                            onSelected(selectedResource);
                        }}
                    >
                        {selected ? `Play Game` : `Select Game`}
                    </Button>
                </div>
            </div>
        </button>
    );
}

export default GamemodeDetailsCard;
