/** @format */

/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

const MC = Client.getMinecraft();
const RIGHTCLICK = MC.getClass().getDeclaredMethod("func_147121_ag");
RIGHTCLICK.setAccessible(true);

export function setupRule(petName) {
	let waitTime = 500;
	new Thread(() => {
		let clickSlot = -1;
		let dilloSlot = -1;

		let selectDClickSlot = -1;
		let selectPetClickSlot = -1;

		Player.setHeldItemIndex(8);
		RIGHTCLICK.invoke(MC);

		Thread.sleep(waitTime);

		Player.getOpenedInventory().click(30);

		Thread.sleep(waitTime);

		if (
			!Player.getOpenedInventory()
				.getStackInSlot(46)
				.getName()
				.toString()
				.includes("Autopet")
		)
			return;

		Player.getOpenedInventory().click(46);
		Thread.sleep(waitTime);
		selectSmh("Create Rule");
		Thread.sleep(waitTime);
		Player.getOpenedInventory().click(25);
		Thread.sleep(waitTime);
		clickOnSpecificPet(petName);
		Thread.sleep(waitTime);
		clickOnSpecificPet(petName);
		Thread.sleep(waitTime);
		selectSmh("Add Rule Exception");
		Thread.sleep(waitTime);
		Player.getOpenedInventory().click(12);
		Thread.sleep(waitTime);
		clickOnSpecificPet("Armadillo");
		Thread.sleep(waitTime);

		Player.getOpenedInventory().click(39);

		Thread.sleep(waitTime);
		selectSmh("Create Rule");
		Thread.sleep(waitTime);
		Player.getOpenedInventory().click(25);
		Thread.sleep(1000);
		clickOnSpecificPet("Armadillo");
		Thread.sleep(waitTime);

		clickOnSpecificPet(petName);
		Thread.sleep(waitTime);
		Player.getOpenedInventory().click(22);
	}).start();
}

function selectSmh(something) {
	for (let i = 9; i < 45; i++) {
		if (Player.getOpenedInventory().getStackInSlot(i) !== null) {
			let itemName = Player.getOpenedInventory().getStackInSlot(i).getName();

			if (itemName.toString().toLowerCase().includes(something.toLowerCase())) {
				Player.getOpenedInventory().click(i);

				break;
			}
		}
	}
}

function clickOnSpecificPet(pet) {
	for (let i = 0; i < 52; i++) {
		if (Player.getOpenedInventory().getStackInSlot(i) !== null) {
			let itemName = Player.getOpenedInventory().getStackInSlot(i).getLore();

			for (let j = 0; j < itemName.length; j++) {
				if (itemName[j].toString().toLowerCase().includes(pet.toLowerCase())) {
					Player.getOpenedInventory().click(i);

					break;
				}
			}
		}
	}
}
