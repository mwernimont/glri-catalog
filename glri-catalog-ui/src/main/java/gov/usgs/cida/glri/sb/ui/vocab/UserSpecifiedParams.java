package gov.usgs.cida.glri.sb.ui.vocab;

import org.apache.commons.lang3.StringUtils;

import gov.usgs.cida.glri.sb.ui.ParameterProcessor;

/**
 * Simple pass-through conversion of parameters
 * to see it.
 * @author eeverman
 */
public enum UserSpecifiedParams implements ParameterProcessor {
	
	PARENT_ID("parentId", "parentId"),
	UNKNOWN("", "");
	

	private final String localName;
	private final String remoteParamName;
	
	UserSpecifiedParams(String localName, String remoteParamName) {
		this.localName = localName;
		this.remoteParamName = remoteParamName;
	}
	
	public String getRemoteName() {
		return remoteParamName;
	}
	
	public String getLocalName() {
		return localName;
	}
	
	
	/**
	 * Finds a tag for a given shortName or null if it cannot be found.
	 * 
	 * @param localName Case Insensitive
	 * @return tag
	 */
	public UserSpecifiedParams getForLocalName(String localName) {
		localName = StringUtils.trimToNull(localName);
		if (localName == null) return null;
		localName = localName.toLowerCase();
		
		
		for (UserSpecifiedParams tag : UserSpecifiedParams.values()) {
			if (tag.localName.equals(localName)) return tag;
		}
		
		return null;
	}
	
	@Override
	public String processParamValue(String[] values) {
		if (values != null && values.length > 0) {
			String val = StringUtils.trimToNull(values[0]);
			if (val != null) {
				return processParamValue(val);
			}
		}
		return null;
	}
	
	@Override
	public String processParamValue(String value) {
		value = StringUtils.trimToNull(value);
		if (value != null) {
			return value;
		} else {
			return null;
		}
	}
	
	/**
	 * Get the parameter name.
	 * 
	 * In some cases the value is encoded into the param name, so we keep that
	 * possibility/convention here, even though not used.
	 * 
	 * @param value param
	 * @return remote name
	 */
	@Override
	public String processParamName(String value) {
		return getRemoteName();
	}
}
