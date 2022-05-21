import {
    Abstract2dArt,
    classNames,
    declareModule,
    makeArtModule,
    randomJavascriptName,
    React,
} from '@collboard/modules-sdk';
import { IVectorData, Vector } from 'xyzt';
import { contributors, description, license, repository, version } from '../../package.json';

export const SVG_PADDING = 0; /* <- TODO; !!! Remove */
export const IS_NEAR_DISTANCE = 20;

export class FreehandAnimatedArt extends Abstract2dArt {
    // TODO: Some clear rules how to name serializeName and module names (+ adding scopes and versions there)
    // TODO: How to handle versioning in arts?
    public static serializeName = 'FreehandAnimated';
    public static manifest = {
        name: '@hejny/freehand-animated',
        contributors,
        description,
        license,
        repository,
        version,
    };

    private minX: number = 0;
    private maxX: number = 0;
    private minY: number = 0;
    private maxY: number = 0;

    public constructor(
        public path: IVectorData[],
        public color: string,
        public animation: string,
        public weight: number,
    ) {
        super();
    }

    public get topLeftCorner() {
        return new Vector(this.minX, this.minY).add(this.shift);
    }
    public get bottomRightCorner() {
        return new Vector(this.maxX, this.maxY).add(this.shift);
    }
    public get size() {
        return this.bottomRightCorner.subtract(this.topLeftCorner);
    }
    public set size(newSize: Vector) {
        try {
            const scaleX = (newSize.x || 0) / (this.maxX - this.minX);
            const scaleY = (newSize.y || 0) / (this.maxY - this.minY);

            this.path.forEach((point) => {
                point.x = (point.x || 0) * scaleX;
                point.y = (point.y || 0) * scaleY;
            });
            this.calculateBoundingBox();
        } catch (e) {
            this.calculateBoundingBox();
        }
    }

    public isNear(point2: IVectorData) {
        return (
            this.path.filter((point) => Vector.add(point, this.shift).distance(point2) <= IS_NEAR_DISTANCE).length > 0
        );
    }

    public get acceptedAttributes() {
        return ['color', 'weight', 'size'];
    }

    private calculateBoundingBox() {
        const xVals = this.path.map((point) => point.x || 0);
        const yVals = this.path.map((point) => point.y || 0);
        this.minX = Math.min.apply(null, xVals);
        this.maxX = Math.max.apply(null, xVals);
        this.minY = Math.min.apply(null, yVals);
        this.maxY = Math.max.apply(null, yVals);
    }

    private get svgpath(): string {
        return this.path
            .map((point, i) => {
                const pointRelative = Vector.subtract(
                    point,
                    new Vector(this.minX - SVG_PADDING, this.minY - SVG_PADDING),
                );
                return `${i === 0 ? 'M' : 'L'}${pointRelative.x} ${pointRelative.y}`;
            })
            .join(' ');
    }

    private createStyle(scope: string) {
        switch (this.animation) {
            case 'flow':
                return (
                    <style>
                        {`
                          .${scope}-path {
                            stroke-dasharray: 100;

                            animation-name: ${scope}-animation;
                            animation-duration: 5s;
                            animation-timing-function: linear;
                            animation-iteration-count: infinite;
                          }

                          @keyframes ${scope}-animation {
                            from {
                              stroke-dashoffset: 0;
                            }
                            to {
                              stroke-dashoffset: 1000;
                            }
                          }
                        `}
                    </style>
                );
            case 'complete':
                return (
                    <style>
                        {`
                          .${scope}-path {
                            stroke-dasharray: 1000;
                            animation-name: ${scope}-animation;
                            animation-duration: 5s;
                            animation-timing-function: ease;
                            animation-iteration-count: 1;
                          }

                          @keyframes ${scope}-animation {
                            from {
                              stroke-dashoffset: 1000;
                            }
                            to {
                              stroke-dashoffset: 0;
                            }
                          }
                        `}
                    </style>
                );

            default:
                return <></>;
        }
    }

    render(selected: boolean) {
        this.calculateBoundingBox();

        const scope = randomJavascriptName({ prefix: 'freehand-animated' });
        return (
            <div
                className={classNames('art', selected && 'selected')}
                style={{
                    position: 'absolute',
                    left: this.minX - SVG_PADDING + (this.shift.x || 0),
                    top: this.minY - SVG_PADDING + (this.shift.y || 0),
                }}
            >
                <svg
                    width={this.maxX - this.minX + 2 * SVG_PADDING}
                    height={this.maxY - this.minY + 2 * SVG_PADDING}
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ overflow: 'visible' }}
                >
                    {this.createStyle(scope)}
                    <g>
                        <path
                            d={this.svgpath}
                            stroke={this.color}
                            strokeWidth={this.weight}
                            fillOpacity="null"
                            strokeOpacity="null"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="transparent"
                            className={`${scope}-path`}
                        />
                    </g>
                </svg>
            </div>
        );
    }
}

declareModule(makeArtModule(FreehandAnimatedArt));

/**
 * TODO: Do not stop on rerendering.
 */
