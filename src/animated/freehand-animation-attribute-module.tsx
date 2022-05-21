import { declareModule, Icon, makeAttributeModule, React } from '@collboard/modules-sdk';
import { contributors, description, license, repository, version } from '../../package.json';

declareModule(
    makeAttributeModule<string>({
        manifest: {
            name: '@hejny/freehand-animation-attribute',
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
            name: 'freehand-animation',
            defaultValue: 'flow',
        },
        inputRender: (value: string, onChange: (value: string) => void) => (
            <>
                <Icon icon="🚶‍♀️" active={value === 'flow'} onClick={() => onChange('flow')} />
                <Icon icon="✔️" active={value === 'complete'} onClick={() => onChange('complete')} />
                {/* TODO: water, fire,... */}
            </>
        ),
    }),
);
