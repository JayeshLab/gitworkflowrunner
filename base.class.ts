export class BaseClass {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor, @typescript-eslint/no-unused-vars
	public constructor(...args: any[]) {
		// Please do not get in the habit of using the above eslint-disable lines. They are
		// necessary here to allow us to define a generic base class which has a rest parameter,
		// which definition is necessary for our mixins to be applied to.
	}
}
