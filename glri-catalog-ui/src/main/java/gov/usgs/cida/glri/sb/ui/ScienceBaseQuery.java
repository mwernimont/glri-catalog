package gov.usgs.cida.glri.sb.ui;

import com.google.common.io.CharStreams;
import java.io.InputStreamReader;
import java.util.Map;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

/**
 * Builds a query to ScienceBase w/ mappings between local parameters and SB
 * parameters.
 * @author eeverman
 */
public class ScienceBaseQuery {
	
	private static Format DEFAULT_FORMAT = Format.HTML;
	public static final String DEFAULT_ENCODING = "UTF-8";
	
	
	private Format format = Format.UNKNOWN;
	
	
	
	public String getQueryResponse(Map<String, String[]> requestParams) throws Exception {
		CloseableHttpClient httpclient = HttpClients.createDefault();
		URIBuilder uriBuild = new URIBuilder();
		uriBuild.setScheme("https");
		uriBuild.setHost(AppConfig.get(AppConfig.SCIENCEBASE_HOST));
		uriBuild.setPath("/catalog/items");
		appendUserParams(requestParams, uriBuild);
		appendSystemParams(requestParams, uriBuild);
		appendSpatialParams(requestParams, uriBuild);
		
		HttpGet httpGet = new HttpGet(uriBuild.build());
		System.out.println(httpGet.getURI());
		httpGet.addHeader("Accept", "application/json,application/xml,text/html");
		CloseableHttpResponse response1 = httpclient.execute(httpGet);

		try {
			System.out.println(response1.getStatusLine());
			HttpEntity entity = response1.getEntity();
			
			String encoding = findEncoding(entity, DEFAULT_ENCODING);
			String stringFromStream = CharStreams.toString(new InputStreamReader(entity.getContent(), encoding));
			
			EntityUtils.consume(entity);
			
			return stringFromStream;
		} finally {
			response1.close();
		}

	}
	
	public Format getRequestedFormat() {
		return format;
	}
	
	/**
	 * Parses an http contentType header string into the encoding, if it exists.
	 * If it cannot find the encoding, the default is returned.
	 * 
	 * @param entity Find the header in this entity
	 * @param defaultEncoding Return this encoding if we cannot find the value in the header.
	 * @return 
	 */
	protected String findEncoding(HttpEntity entity, String defaultEncoding) {
		
		try {
			return findEncoding(entity.getContentType().getValue(), defaultEncoding);
		} catch (RuntimeException e) {
			return defaultEncoding;
		}
	}
	
	/**
	 * Parses an http contentType header string into the encoding, if it exists.
	 * If it cannot find the encoding, the default is returned.
	 * 
	 * @param contentTypeHeaderString The String value of the http contentType header
	 * @param defaultEncoding Return this encoding if we cannot find the value in the header.
	 * @return 
	 */
	protected String findEncoding(String contentTypeHeaderString, String defaultEncoding) {
		
		try {
			//Example contentType:  text/html; charset=utf-8

			String[] parts = contentTypeHeaderString.split(";");
			String encoding = StringUtils.trimToNull(parts[1]);
			parts = encoding.split("=");
			
			if (parts[0].trim().equalsIgnoreCase("charset")) {
				encoding = StringUtils.trimToNull(parts[1]);
				return encoding.toUpperCase();
			} else {
				return defaultEncoding;
			}
			
		} catch (RuntimeException e) {
			return defaultEncoding;
		}
	}
	
	protected void appendUserParams(Map<String, String[]> requestParams, URIBuilder uriBuild) {
		for (UserSpecifiedParameters tag : UserSpecifiedParameters.values()) {
			String val = tag.processParamValue(requestParams.get(tag.getLocalName()));
			
			if (val != null) {
				uriBuild.addParameter(tag.processParamName(val), val);
			}
		}
	}
	
	protected void appendSystemParams(Map<String, String[]> requestParams, URIBuilder uriBuild) {
		
		
		for (SystemSuppliedParameters tag : SystemSuppliedParameters.values()) {
			
			if (tag.getType().isAllowClientValue()) {
				String[] vals = requestParams.get(tag.getLocalName());
				if (vals != null && vals.length > 0) {
					String val = StringUtils.trimToNull(vals[0]);

					if (val != null) {
						uriBuild.addParameter(tag.getRemoteName(), val);
					}	
				} else if (tag.getType().isAllowDefault() && tag.hasDefault()) {
					//No client value, so use the default value
					uriBuild.addParameter(tag.getRemoteName(), tag.getDefaultValue());
				}
			} else {
				
				String defaultVal = tag.getDefaultValue();
				
				if (tag.getType().isLookupDefault()) {
					//This default is a key to lookup the value in the app config
					defaultVal = AppConfig.get(defaultVal);
				}
				//Client values not allowed - force in our default value
				uriBuild.addParameter(tag.getRemoteName(), defaultVal);
			}
		}
			
	}
	
	protected void appendSpatialParams(Map<String, String[]> requestParams, URIBuilder uriBuild) {
		String[] spatialQuery = requestParams.get(SystemSuppliedParameters.SPATIAL);
		
		if((spatialQuery != null) && (spatialQuery.length > 0)) {
			String val = StringUtils.trimToNull(spatialQuery[0]);
			if (val != null) {
				System.out.println("Spatial Param: [" + val + "]");
				uriBuild.addParameter(SystemSuppliedParameters.SPATIAL.getRemoteName(), val);
			}
		}
	}
}
