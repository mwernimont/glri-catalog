/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gov.usgs.cida.glri.sb.ui;

import org.apache.commons.lang3.StringUtils;

/**
 *
 * @author eeverman
 */
public enum ControlParam {
	
	GLRI_PROJECT_ONLY("glri_only", "parentId", "52e6a0a0e4b012954a1a238a");
	
	private final String shortName;
	private final String fullName;
	private final String value;
	
	ControlParam(String shortName, String fullName, String value) {
		this.shortName = shortName;
		this.fullName = fullName;
		this.value = value;
	}
	

	public String getFullName() {
		return fullName;
	}
	
	public String getShortName() {
		return shortName;
	}
	
	public String getValue() {
		return value;
	}
	
	/**
	 * Finds a tag for a given shortName or null if it cannot be found.
	 * 
	 * @param shortName Case Insensitive
	 * @return 
	 */
	public ControlParam getForShortName(String shortName) {
		shortName = StringUtils.trimToNull(shortName);
		if (shortName == null) return null;
		shortName = shortName.toLowerCase();
		
		
		for (ControlParam tag : ControlParam.values()) {
			if (tag.shortName.equals(shortName)) return tag;
		}
		
		return null;
	}
}
