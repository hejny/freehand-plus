import { declareModule, Icon, makeAttributeModule, React, string_url_image } from '@collboard/modules-sdk';
import dashedIcon from '../assets/icons/dashed.png';
import dottedIcon from '../assets/icons/dotted.png';
import solidIcon from '../assets/icons/solid.png';
import { contributors, description, license, repository, version } from '../package.json';

export const DASHPATTERNS: { [key: string]: { icon: string_url_image; dasharray: number[] } } = {
    solid: { icon: solidIcon, dasharray: [] },
    dotted: { icon: dottedIcon, dasharray: [1, 4] },
    dashed: { icon: dashedIcon, dasharray: [4] },
};

declareModule(
    makeAttributeModule<string>({
        manifest: {
            name: '@collboard-templates/dashpattern-attribute',
            version,
            description,
            contributors,
            license,
            repository,
            flags: {
                isTemplate: true,
            },
        },
        standard: true,
        attribute: {
            type: 'string',
            name: 'dashpattern',
            defaultValue: 'dotted',
        },
        inputRender: (value: string, onChange: (value: string) => void) => (
            <>
                {Object.entries(DASHPATTERNS).map(([key, { icon }]) => (
                    <Icon {...{ key, icon }} active={value === key} onClick={() => onChange(key)} />
                ))}
            </>
        ),
    }),
);
