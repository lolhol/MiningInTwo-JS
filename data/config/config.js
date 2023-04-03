/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import {
    @ButtonProperty,
    @CheckboxProperty,
    Color,
    @ColorProperty,
    @PercentSliderProperty,
    @SelectorProperty,
    @SwitchProperty,
    @TextProperty,
    @SliderProperty,
    @Vigilant,
} from 'Vigilance/index';


@Vigilant('MiningInTwo', 'MiningInTwo', {
    getCategoryComparator: () => (a, b) => {
        const categories = ["Main", "Fail-Safes", "Fun", "Structure-Finder", "TP-Settings" ];
        return categories.indexOf(a.name) - categories.indexOf(b.name);
    } 
})

class Settings {

    @CheckboxProperty({
        name: 'PlayerESP',
        description: 'Player ESP',
        category: 'Fail-Safes'
    })
    ShowNearPlayers = true;


    @SwitchProperty({
        name: 'Player ESP',
        description: 'Highlights a players within x blocks of you',
        category: 'Fail-Safes',
    })
    ShowNearPlayers = false;

    @SliderProperty({
        name: 'Player ESP Distance ',
        description: 'How far Player ESP should detect players (too high might affect performance & might not work as render distance cap) ',
        category: 'Fail-Safes',
        min: 0,
        max: 500,
    })
    espplayerdistance = 15;

    //FUN :)

    @SliderProperty({
        name: 'Block ESP color Blue',
        description: 'Add blue color to block ESP',
        category: 'Fun',
        min: 0,
        max: 10,
    })
    ESPBlueColor = 0;

    @SliderProperty({
        name: 'Block ESP color Red',
        description: 'Add blue color to block ESP',
        category: 'Fun',
        min: 0,
        max: 10,
    })
    ESPRedColor = 0;

    @SliderProperty({
        name: 'Block ESP color Green',
        description: 'Add green color to block ESP',
        category: 'Fun',
        min: 0,
        max: 10,
    })
    ESPGreenColor = 0;

    @SwitchProperty({
        name: 'Render Block-To-Block Lines',
        description: 'Looks cool so :) (only for auto mode)',
        category: 'Fun',
    })
    renderBlockLines = false;

    @SwitchProperty({
        name: 'Turn on/off',
        description: 'basically makes the block-to-block line a chroma thing',
        category: 'Fun',
    })
    chromaMode = false;

    @SwitchProperty({
        name: 'Actually switch to aotv',
        description: 'Basically actually switches to the aotv slot (instead of using packets) has no effect on the macro except that it look better?',
        category: 'Fun',
    })
    switchToAOTV = false;

    //Main
    @SwitchProperty({
        name: 'Wait on first point',
        description: 'When turned on, will wait like 10sec on the first point (to regen dillo energy)',
        category: 'Main',
    })
    regenWait = false;

    @SliderProperty({
        name: 'Wait on first point wait time',
        description: 'Customise how long it waits for 1000 = 1 second (default is 10 sec)',
        category: 'Main',
        min: 0,
        max: 50000
    })
    regenWaitTime = 10000;

    @SwitchProperty({
        name: 'Top-to-bottom',
        description: 'On = top to bottom, off = normal.',
        category: 'Main',
    })
    topToBottom = false;

    @SliderProperty({
        name: 'Rotation angle',
        description: 'Basically the rortation angle of the macro (i would recommend either 150 or 200 depending on ur route)',
        category: 'Main',
        min: 100,
        max: 360
    })
    rotationAnlge = 180;

    @SliderProperty({
        name: 'Smoothlook',
        description: 'Customize how smooth the macro looks at shit (1 is lowest, 10 is highest)',
        category: 'Main',
        min: 1,
        max: 10
    })
    SPEED = 5;

    @SelectorProperty({
        name: 'Macro spot',
        description: 'Select a default spot to macro... (comming soon)',
        category: 'Main',
        options: ["Default", "Custom"],
    })
    macroSpot = 0;

    @SwitchProperty({
        name: 'Block On Route ESP',
        description: 'Display block ESP',
        category: 'Main',
    })
    render = false;

    @TextProperty({
        name: 'Clear command (after editing do /ct load)',
        category: 'Main',
    })
    clearCommand = "clear";

    @TextProperty({
        name: 'Replace block command (after editing do /ct load)',
        category: 'Main',
    })
    replaceBlock = "replaceBlock";

    //Structure Finder

    @SwitchProperty({
        name: 'Structure Finder',
        description: 'Enable/Desable (idk how fast dis is but eh',
        category: 'Structure-Finder',
    })
    findStructure = false;

    //Tp settings

    @SliderProperty({
        name: 'look time (in ms)',
        description: 'look time.',
        category: 'TP-Settings',
        min: 2,
        max: 1000
    })
    smoothLook = 150;

    @SliderProperty({
        name: 'AOTV wait time',
        description: 'Basically this is if ur low on mana and ye the more u have the lower u can put this to (also if u have very high mana regen thing)',
        category: 'TP-Settings',
        min: 50,
        max: 3000
    })
    AOTVdelay = 650;

    @SliderProperty({
        name: 'Ping mode',
        description: 'Basically set this to ur ping if its above like 70. OTHERWISE SET THIS TO 10 OR LESS!',
        category: 'TP-Settings',
        min: 1,
        max: 700
    })
    ping = 100;

    @SliderProperty({
        name: 'kmeffm',
        description: 'Basically set this to ur ping if its above like 70. OTHERWISE SET THIS TO 10 OR LESS!',
        category: 'TP-Settings',
        min: 0,
        max: 700
    })
    nukertype = 0;

    @SwitchProperty({
        name: 'Re-Teleport',
        description: 'Also very important if u wana afk dillo macro.',
        category: 'TP-Settings',
    })
    reTp = false;

    @SliderProperty({
        name: 'Re-Tp amount of times',
        description: 'Basically re-tp x amount of times',
        category: 'TP-Settings',
        min: 1,
        max: 5
    })
    reTpTimes = 2;
    
    constructor() {
        this.initialize(this);
        //this.registerListener('textInput', newText => {
        //console.log(Text changed to ${newText});
        //});
    }
}

export default new Settings;