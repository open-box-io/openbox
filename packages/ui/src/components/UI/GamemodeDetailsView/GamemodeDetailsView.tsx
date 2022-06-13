import React, { useEffect, useState } from 'react';
import {
    getGithubResourceFile,
    getGithubResourceList,
} from '../../../api/game';

import Button from '../Button/Button';
import { GamemodeResponse } from '@openbox/common';
import { cssCombine } from '../../../shared/SCSS/scssHelpers';
import styles from './gamemodeDetailsView.module.scss';

interface GamemodeDetailsViewProps {
    game: GamemodeResponse;
    selected?: boolean;

    onSelected: (resources?: string) => void;
}

function GamemodeDetailsView({
    game,
    selected,
    onSelected,
}: GamemodeDetailsViewProps): JSX.Element {
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
            className={styles.Gamemode}
        >
            <div className={styles.NameAuthor}>
                <div className={styles.Name}>{game.name}</div>
                <div className={styles.Author}>{game.author.nickname}</div>
            </div>
            <div
                className={cssCombine(
                    styles.Description,
                    open ? styles.DescriptionShown : styles.DescriptionHidden,
                )}
            >
                {game.description}
            </div>
            <div className={cssCombine(open ? styles.Detail : styles.Closed)}>
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
        </button>
    );
}

export default GamemodeDetailsView;
