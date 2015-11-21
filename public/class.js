
// Replacement class system
//
// Usage:
// var MyClass = makeClass("MyClass", superClass1, superClass2, ...);
// MyClass.init = function(args) { /* constructor */ };
// MyClass.method =  function(){...};
//
// var myObj = MyClass.create(args); // calls init with args
// myObj.method(); 
// console.log(myObj._type); // prints "MyClass"
//
function makeClass(name){

	// Prototype for the class
	var proto = {};

	// Copy all properties of the superclasses onto the prototype
	for(var i = 1; i < arguments.length; i++){
		var o = arguments[i];
		for(var pName in o)
			proto[pName] = o[pName];
	}

	// Set our _type to the name of the class
	proto._type = name;

	// Factory method to create objects of this class
	proto.create = function(){
		// Create an object from the prototype
		var o = Object.create(this);

		// Run the init method if there is one
		if(this.init)
			this.init.apply(o, arguments);

		return o;
	}

	return proto;
}