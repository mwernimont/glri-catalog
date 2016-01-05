/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gov.usgs.cida.glri.sb.ui.vocab;

import gov.usgs.cida.glri.sb.ui.ParamType;
import org.apache.commons.lang3.StringUtils;
import static gov.usgs.cida.glri.sb.ui.ParamType.*;

/**
 *
 * @author eeverman
 */
public enum SystemSuppliedParams {
	
	/** Format of results to come back */
	FORMAT("format", "format", INCLUDE_IF_PRESENT_OTHERWISE_USE_DEFAULT_VALUE, "json"),
	/** Determines which fields are included in the SB response */
	/** Max number of records to return */
	MAX_RECORDS("max", "max", INCLUDE_IF_PRESENT_OTHERWISE_USE_DEFAULT_VALUE, "1000");

	private final String localName;
	private final String remoteName;
	private final String defaultValue;
	private final ParamType type;
	
	SystemSuppliedParams(String localName, String remoteName, ParamType type) {
		this.localName = localName;
		this.remoteName = remoteName;
		this.type = type;
		this.defaultValue = null;
	}
	
	SystemSuppliedParams(String localName, String remoteName, ParamType type, String defaultValue) {
		this.localName = localName;
		this.remoteName = remoteName;
		this.type = type;
		this.defaultValue = defaultValue;
	}
	
	public String getRemoteName() {
		return remoteName;
	}
	
	public String getLocalName() {
		return localName;
	}
	
	public ParamType getType() {
		return type;
	}
	
	public String getDefaultValue() {
		return defaultValue;
	}
	
	public boolean hasDefault() {
		return defaultValue != null;
	}
	
	/**
	 * Finds a tag for a given shortName or null if it cannot be found.
	 * 
	 * @param shortName Case Insensitive
	 * @return tag
	 */
	public SystemSuppliedParams getForLocalName(String shortName) {
		shortName = StringUtils.trimToNull(shortName);
		if (shortName == null) return null;
		shortName = shortName.toLowerCase();
		
		
		for (SystemSuppliedParams tag : SystemSuppliedParams.values()) {
			if (tag.localName.equals(shortName)) return tag;
		}
		
		return null;
	}
}
