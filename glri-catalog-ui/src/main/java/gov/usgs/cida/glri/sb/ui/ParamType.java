/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gov.usgs.cida.glri.sb.ui;

/**
 * Controls the behaviour of parameters based on their type.
 * @author eeverman
 */
public enum ParamType {
	INCLUDE_IF_PRESENT(true, false, false),
	INCLUDE_IF_PRESENT_OTHERWISE_USE_DEFAULT_VALUE(true, true, false),
	INCLUDE_ALWAYS_WITH_DEFAULT_VALUE_ONLY(false, true, false),
	INCLUDE_ALWAYS_WITH_CONFIGURED_VALUE_ONLY(false, true, true);;
	
	final boolean allowClientValue;
	final boolean allowDefault;
	final boolean lookupDefault;
	
	ParamType(boolean allowClientValue, boolean allowDefault, boolean lookupDefault) {
		this.allowClientValue = allowClientValue;
		this.allowDefault = allowDefault;
		this.lookupDefault = lookupDefault;
	}
	
	/**
	 * If true, the passed in value of this parameter from the user can be used.
	 * If false, ignore any matching user parameter
	 * @return true if allowed by client
	 */
	public boolean isAllowClientValue() {
		return allowClientValue;
	}
	
	/**
	 * If true, the default value should be used if the user did not specify a
	 * value or if user values are not allowed.
	 * @return true if allowed default
	 */
	public boolean isAllowDefault() {
		return allowDefault;
	}
	
	/**
	 * If true, interpret the default value as a lookup key to an entry in the AppConfig.
	 * @return true if lookup default
	 */
	public boolean isLookupDefault() {
		return lookupDefault;
	}
	
	
}
