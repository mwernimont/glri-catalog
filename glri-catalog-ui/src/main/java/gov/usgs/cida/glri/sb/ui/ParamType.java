/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gov.usgs.cida.glri.sb.ui;

/**
 *
 * @author eeverman
 */
public enum ParamType {
	INCLUDE_IF_PRESENT(true, false),
	INCLUDE_IF_PRESENT_OTHERWISE_USE_DEFAULT_VALUE(true, true),
	INCLUDE_ALWAYS_WITH_DEFAULT_VALUE_ONLY(false, true);
	
	final boolean allowClientValue;
	final boolean allowDefault;
	
	ParamType(boolean allowClientValue, boolean allowDefault) {
		this.allowClientValue = allowClientValue;
		this.allowDefault = allowDefault;
	}
	
	public boolean isAllowClientValue() {
		return allowClientValue;
	}
	
	public boolean isAllowDefault() {
		return allowDefault;
	}
	
	
}
