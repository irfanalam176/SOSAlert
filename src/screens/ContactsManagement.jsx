import React, { useEffect, useState } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, Modal, Text, BackHandler } from 'react-native';
import { useStyle } from '../style/style';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ExtraBoldText from '../components/text/ExtraBoldText';
import DropShadow from 'react-native-drop-shadow';
import BoldText from '../components/text/BoldText';
import RegularText from '../components/text/RegularText';
import SmallText from '../components/text/SmallText';
import { lightColor } from '../colors/Colors';
import LoaderKit from 'react-native-loader-kit';
import { useColor } from '../hooks/context/ColorContext';
import firestore from '@react-native-firebase/firestore'; // Import Firestore
import { apiUrl } from '../constants';

const ContactsManagement = ({ navigation, route }) => {
  const { userId } = route.params;
  const style = useStyle();
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [contactList, setContactList] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState({});
  const [errors, setErrors] = useState({});
  const { secondaryColor } = useColor();
  const [contactsLoading, setContactsLoading] = useState(false);
  const [selectionMode, setSetSelectionMode] = useState(false);
  const [contactNotFound, setContactNotFound] = useState("");

  // Validate email input
  const validateInputs = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch contacts from Firestore
  useEffect(() => {
    getAllContacts();
  }, []);

  // Handle back button press
  useEffect(() => {
    const backAction = () => {
      if (Object.keys(selectedContacts).length > 0) {
        setSelectedContacts({}); // Deselect all contacts
        return true; // Prevent default behavior (going back)
      } else {
        navigation.goBack(); // Navigate back if no contacts are selected
        return true; // Prevent default behavior (going back)
      }
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove(); // Cleanup the event listener
  }, [selectedContacts]);

  // Add a new contact to the linked_contacts map
const addContact = async () => {
  setIsLoading(true);
  if (validateInputs()) {
    try {
      const response = await fetch(`${apiUrl}/contact/add-contact/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.contactError) {
        setErrors({ email: result.message || 'Error adding contact' });
      } else if (result.contactAdded) {
        handleModalClose();
        getAllContacts(); // Refresh list after adding
      } else {
        setErrors({ email: 'Failed to add contact' });
      }
    } catch (error) {
      console.error('Add contact error:', error);
      setErrors({ email: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  } else {
    setIsLoading(false);
  }
};


  // Fetch all contacts from the linked_contacts map
const getAllContacts = async () => {
  setContactsLoading(true);
  try {
    const response = await fetch(`${apiUrl}/contact/get-contacts/${userId}`);
    const result = await response.json();

    if (!result.contactFound) {
      setContactNotFound(result.message || 'No contacts found.');
      setContactList([]);
    } else {
      setContactList(result.contactsList);
      setContactNotFound('');
    }
  } catch (error) {
    console.error('Get contacts error:', error);
    setContactNotFound('An error occurred while fetching contacts.');
  } finally {
    setSelectedContacts({});
    setContactsLoading(false);
  }
};


  // Handle long press to select contacts
  const handleLongPress = (contactId) => {
    setSetSelectionMode(true);
    setSelectedContacts(prev => ({
      ...prev,
      [contactId]: !prev[contactId], // Toggle selection
    }));
  };

  // Handle press to select/deselect contacts
  const handlePress = (contactId) => {
    if (selectionMode) {
      setSelectedContacts(prev => {
        const updatedContacts = { ...prev };

        if (updatedContacts[contactId]) {
          delete updatedContacts[contactId]; // Remove if already selected
        } else {
          updatedContacts[contactId] = true; // Add if not selected
        }

        if (Object.keys(updatedContacts).length === 0) {
          setSetSelectionMode(false);
        }

        return updatedContacts;
      });
    }
  };

  // Delete selected contacts from the linked_contacts map
const handleDelete = async () => {
  setIsDeleting(true);
  const selectedIds = Object.keys(selectedContacts).filter(id => selectedContacts[id]);

  if (selectedIds.length === 0) {
    setIsDeleting(false);
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/contact/delete-contacts/${userId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedIds }),
    });

    const result = await response.json();

    if (result.delete) {
      setDeleteModal(false);
      getAllContacts();
    } else {
      setErrors({ delete: 'Failed to delete contacts' });
    }
  } catch (error) {
    console.error('Delete contacts error:', error);
    setErrors({ delete: 'An error occurred while deleting contacts.' });
  } finally {
    setIsDeleting(false);
  }
};


  // Close the add contact modal
  const handleModalClose = () => {
    setModalVisible(false);
    setEmail('');
    setIsLoading(false);
    setErrors({ email: '' });
  };

  // Go back to the previous screen
  const goBack = () => {
    if (Object.keys(selectedContacts).length > 0) {
      setSelectedContacts({}); // Deselect all contacts
    } else {
      navigation.goBack(); // Navigate back if no contacts are selected
    }
  };

  return (
    <View style={[style.mainBg, style.wrapper]}>
      {/* Add Contact Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}>
        <View style={style.centeredView}>
          <View style={style.modalView}>
            <View style={style.header}>
              <ExtraBoldText style={{ marginBottom: 0, marginHorizontal: 'auto' }}>
                Add Contact
              </ExtraBoldText>
              <TouchableOpacity onPress={handleModalClose}>
                <FontAwesome5 name="times-circle" size={25} style={style.formIcon} />
              </TouchableOpacity>
            </View>

            <RegularText style={{ marginTop: 40 }}>
              Enter Email of trusted person
            </RegularText>
            <View style={style.inputBox}>
              <FontAwesome5 name="envelope" size={20} style={style.formIcon} />
              <TextInput
                style={style.input}
                placeholder="Enter Email of trusted person"
                placeholderTextColor="#999"
                keyboardType="email-address"
                onChangeText={setEmail}
              />
            </View>
            {errors.email && (
              <SmallText style={style.error}>{errors.email}</SmallText>
            )}
            <TouchableOpacity
              style={style.mainBtn}
              onPress={addContact}
              disabled={isLoading}>
              {isLoading ? (
                <LoaderKit
                  style={{ width: 50, height: 30, marginHorizontal: 'auto' }}
                  name={'BallPulse'}
                  color={'white'}
                />
              ) : (
                <Text style={style.mainBtnText}>Add Contact</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Contacts Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModal}
        onRequestClose={() => setDeleteModal(!deleteModal)}>
        <View style={style.centeredView}>
          <View style={style.modalView}>
            <View style={style.header}>
              <ExtraBoldText style={{ marginBottom: 0, marginHorizontal: 'auto' }}>
                Delete Contacts
              </ExtraBoldText>
              <TouchableOpacity onPress={() => setDeleteModal(!deleteModal)}>
                <FontAwesome5 name="times-circle" size={25} style={style.formIcon} />
              </TouchableOpacity>
            </View>

            <RegularText style={{ marginTop: 40, textAlign: 'center' }}>
              Do You Want To Delete Contacts?
            </RegularText>

            {errors.delete && (
              <SmallText style={style.error}>{errors.delete}</SmallText>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
              <TouchableOpacity style={style.mainBtn} onPress={handleDelete} disabled={isDeleting}>
                {isDeleting ? (
                  <LoaderKit
                    style={{ width: 50, height: 30, marginHorizontal: 'auto' }}
                    name={'BallPulse'}
                    color={'white'}
                  />
                ) : (
                  <Text style={style.mainBtnText}>Delete</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[style.mainBtn, { backgroundColor: 'white', borderColor: secondaryColor, borderWidth: 2 }]}
                onPress={() => setDeleteModal(!deleteModal)}>
                <Text style={[style.mainBtnText, { color: secondaryColor }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={style.header}>
        <TouchableOpacity onPress={goBack}>
          <FontAwesome5 name="chevron-left" size={25} style={style.formIcon} />
        </TouchableOpacity>
        <ExtraBoldText style={{ marginBottom: 0, marginHorizontal: 'auto' }}>
          Contacts
        </ExtraBoldText>
        {Object.keys(selectedContacts).length > 0 && (
          <TouchableOpacity style={style.deleteBtn} onPress={() => setDeleteModal(true)}>
            <FontAwesome5 name="trash" size={20} color={'white'} />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Bar */}
      <DropShadow
        style={{
          shadowColor: 'black',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 2,
          marginVertical: 15,
        }}>
        <View style={style.inputBox}>
          <FontAwesome5 name="search" size={15} style={style.formIcon} />
          <TextInput
            style={style.input}
            placeholder="Search Contact..."
            placeholderTextColor="#999"
          />
        </View>
      </DropShadow>

      {/* Contact List */}
      {contactsLoading ? (
        <LoaderKit
          style={{ width: 50, height: 100, marginHorizontal: 'auto' }}
          name={'BallPulse'}
          color={secondaryColor}
        />
      ) : (
        <View>
          {contactNotFound.length > 0 && <BoldText style={{ textAlign: 'center' }}>{contactNotFound}</BoldText>}
          <ScrollView
            style={[style.form, { marginTop: 10, height: 550 }]}
            contentContainerStyle={{ paddingBottom: 100 }}>
            {contactList?.map((contact) => {
              const isSelected = selectedContacts[contact.id] || false;

              return (
                <View key={contact.id} style={{ overflow: 'hidden', marginBottom: 10 }}>
                  <TouchableOpacity
                    onLongPress={() => handleLongPress(contact.id)}
                    onPress={() => handlePress(contact.id)}
                    style={[style.contactCard, { backgroundColor: isSelected ? secondaryColor : 'white' }]}>
                    <BoldText style={{ color: isSelected ? 'white' : 'black' }}>{contact.name}</BoldText>
                    <RegularText style={{ color: isSelected ? 'white' : 'black' }}>{contact.email}</RegularText>
                    <SmallText style={{ color: isSelected ? 'white' : 'black' }}>{contact.phone}</SmallText>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Floating Add Button */}
      <TouchableOpacity
        style={style.floatingBtn}
        onPress={() => setModalVisible(true)}>
        <FontAwesome5 name="plus" size={25} color={lightColor} />
      </TouchableOpacity>
    </View>
  );
};

export default ContactsManagement;